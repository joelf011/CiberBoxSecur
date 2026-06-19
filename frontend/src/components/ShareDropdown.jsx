import React, { useState, useEffect, useRef } from 'react';
import { FaShareAlt, FaLinkedin, FaFacebook, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

/**
 * Dropdown reutilizável de partilha social.
 * Permite partilhar um conteúdo (título + URL) via LinkedIn, Facebook, WhatsApp ou Email.
 * Utilizado, por exemplo, na página de detalhe de artigos de notícias.
 */
const ShareDropdown = ({ title, url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora do componente.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Constrói o URL de partilha para cada plataforma e abre numa nova janela.
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = '';

    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      // O email abre na mesma janela; as redes sociais abrem numa nova.
      const target = platform === 'email' ? '_self' : '_blank';
      window.open(shareUrl, target, 'noopener,noreferrer');
    }
    
    setIsOpen(false);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary fw-semibold d-inline-flex align-items-center gap-2"
      >
        <FaShareAlt />
        Partilhar
      </button>

      {/* Menu de opções de partilha */}
      {isOpen && (
        <div 
          className="position-absolute top-100 start-0 mt-2 bg-white rounded-3 shadow-lg border border-light p-2"
          style={{ minWidth: '160px', zIndex: 1050 }}
        >
          <button onClick={() => handleShare('linkedin')} className="dropdown-item d-flex align-items-center gap-3 py-2 text-secondary">
            <FaLinkedin className="text-primary"/> LinkedIn
          </button>
          
          <button onClick={() => handleShare('facebook')} className="dropdown-item d-flex align-items-center gap-3 py-2 text-secondary">
            <FaFacebook className="text-primary"/> Facebook
          </button>
          
          <button onClick={() => handleShare('whatsapp')} className="dropdown-item d-flex align-items-center gap-3 py-2 text-secondary">
            <FaWhatsapp className="text-success"/> WhatsApp
          </button>
          
          <hr className="dropdown-divider my-1"/>
          
          <button onClick={() => handleShare('email')} className="dropdown-item d-flex align-items-center gap-3 py-2 text-secondary">
            <FaEnvelope className="text-secondary"/> Email
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;