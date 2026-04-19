import { useState } from 'react'

export default function Forms() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Enviar mensagem', formData)
  }

  return (
    <form
      className="p-4 p-md-5 rounded-4 border border-secondary bg-dark text-white shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        {/* Acessibilidade (htmlFor) + Design refinado (text-white-50 small) */}
        <label htmlFor="contact-name" className="form-label text-white-50 small fw-medium">
          Nome
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="form-control bg-secondary bg-opacity-10 text-white border-secondary px-3 py-2"
          placeholder="O seu nome"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email" className="form-label text-white-50 small fw-medium">
          E-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control bg-secondary bg-opacity-10 text-white border-secondary px-3 py-2"
          placeholder="email@empresa.com"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact-message" className="form-label text-white-50 small fw-medium">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="form-control bg-secondary bg-opacity-10 text-white border-secondary px-3 py-2"
          placeholder="Como podemos ajudar?"
          style={{ resize: 'none' }} // Bloqueia o redimensionamento
          required
        />
      </div>

      {/* Botão mais alto (py-3) e com type="submit" */}
      <button 
        type="submit" 
        className="btn btn-primary w-100 py-3 mt-2 fw-semibold rounded-3"
      >
        Enviar Mensagem
      </button>
    </form>
  )
}
