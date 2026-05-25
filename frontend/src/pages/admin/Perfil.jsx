import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCamera, faSave, faCheck } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'react-easy-crop';;
import { usersApi } from '../../api/usersApi'
import { Alerts } from '../../utils/Alerts';

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Devolve a imagem cortada em Base64
  return canvas.toDataURL('image/jpeg', 0.9); 
};

const Perfil = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null); // Guardar o texto Base64

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados do Cropper (Recorte de Imagem)
  const fileInputRef = useRef(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 1. Carregar os dados ao abrir a página
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const data = await usersApi.getMyProfile();
        setName(data.name);
        setEmail(data.email); // O e-mail normalmente não se deixa mudar aqui, apenas ver
        if (data.avatar) setAvatar(data.avatar);
      } catch (error) {
        Alerts.error('Erro ao carregar o perfil.');
      } finally {
        setIsLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Alerts.error('A imagem é demasiado pesada. Escolhe uma com menos de 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageToCrop(reader.result); // Guardar a imagem original
      setShowCropModal(true);        // Abrir a janela de recorte
    };
    e.target.value = ''; // Limpar o input para permitir escolher o mesmo ficheiro de novo
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Confirmar o recorte
  const handleCropConfirm = async () => {
    try {
      // Gera a nova imagem cortada em Base64
      const croppedBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setAvatar(croppedBase64); // Atualiza o ecrã com a foto
      setShowCropModal(false);  // Fecha o Modal
    } catch (e) {
      Alerts.error('Erro ao processar a imagem.');
    }
  };


  // Guardar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // VALIDAÇÃO DE SEGURANÇA MÁXIMA
      // Se o utilizador escreveu em QUALQUER um dos campos de password, disparamos as regras
      if (currentPassword || newPassword || confirmPassword) {
        
        if (!currentPassword) {
          Alerts.error('Tens de inserir a tua password atual para fazer esta alteração.');
          setIsSaving(false);
          return;
        }
        
        if (!newPassword) {
          Alerts.error('Introduziste a password atual, mas falta escrever a nova password.');
          setIsSaving(false);
          return;
        }
        
        if (newPassword !== confirmPassword) {
          Alerts.error('A nova password e a confirmação não coincidem.');
          setIsSaving(false);
          return;
        }
      }

      // Prepara o pacote de dados (Payload)
      const payload = { name };
      if (avatar) payload.avatar = avatar; 
      
      // Só envia as passwords se passaram na validação acima
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      // Envia para o Backend
      await usersApi.updateMyProfile(payload);
      Alerts.success('Perfil atualizado com sucesso!');
      
      // Atualiza a barra lateral em tempo real
      const evento = new CustomEvent('perfilAtualizado');
      window.dispatchEvent(evento);

      // Limpa os campos das passwords
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      Alerts.error(error.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="animate-fade-in py-2 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="fs-4 fw-bold text-dark mb-1">
          <FontAwesomeIcon icon={faUser} className="text-primary me-2" /> O Meu Perfil
        </h2>
        <p className="text-muted small">Gere as tuas informações pessoais, avatar e credenciais de acesso.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              
              {/* Zona da foto */}
              <Col md={4} className="d-flex flex-column align-items-center border-md-end pe-md-4">
                <div 
                  className="position-relative mb-3 cursor-pointer group"
                  onClick={() => fileInputRef.current.click()}
                  style={{ cursor: 'pointer' }}
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="rounded-circle object-fit-cover border shadow-sm" style={{ width: '150px', height: '150px' }} />
                  ) : (
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '150px', height: '150px', fontSize: '3rem' }}>
                      {name ? name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <div className="position-absolute bottom-0 end-0 bg-white text-primary rounded-circle shadow border p-2">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                </div>
                
                <input type="file" accept="image/jpeg, image/png, image/webp" ref={fileInputRef} className="d-none" onChange={handleFileChange} />
                
                <p className="text-muted text-center" style={{ fontSize: '0.75rem' }}>
                  Clica na imagem para alterar.<br/>Apenas JPG, PNG ou WEBP até 2MB.
                </p>
              </Col>

              {/* FORMULÁRIO */}
              <Col md={8} className="ps-md-4">
                <h5 className="fw-bold mb-4">Dados Pessoais</h5>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">Nome Completo</Form.Label>
                  <Form.Control type="text" required className="bg-light border-0 py-2" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-secondary">Endereço de E-mail</Form.Label>
                  <Form.Control type="email" disabled className="bg-light border-0 py-2 text-muted" value={email} />
                </Form.Group>

                <hr className="my-4 text-muted" />

                <h5 className="fw-bold mb-3 text-dark">Credenciais de Acesso</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">Password Atual</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Necessário apenas se quiseres alterar a password" 
                    className="bg-light border-0 py-2"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">Nova Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        className="bg-light border-0 py-2"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        disabled={!currentPassword} // Bloqueado até inserir a atual
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-secondary">Confirmar Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        className="bg-light border-0 py-2"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        disabled={!currentPassword} // Bloqueado até inserir a atual
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit" className="px-4 py-2 fw-bold shadow-sm" disabled={isSaving}>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {isSaving ? 'A Guardar...' : 'Guardar Alterações'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* MODAL DE RECORTE DE IMAGEM */}
      <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Ajustar Fotografia</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark" style={{ height: '350px', position: 'relative' }}>
          {imageToCrop && (
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1} // Obriga a ser um quadrado (para depois ficar redondo)
              cropShape="round" // Mostra uma máscara redonda!
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light d-flex justify-content-between">
          <input 
            type="range" 
            value={zoom} 
            min={1} 
            max={3} 
            step={0.1} 
            aria-labelledby="Zoom" 
            onChange={(e) => setZoom(e.target.value)} 
            className="form-range w-50"
          />
          <Button variant="primary" onClick={handleCropConfirm} className="fw-bold px-4">
            <FontAwesomeIcon icon={faCheck} className="me-2"/> Aplicar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Perfil;