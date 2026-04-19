import React from 'react';
// Importação dos componentes
import Section from './components/Section.jsx';
import ContactInfo from './components/ContactInfo.jsx';
import Forms from './components/Forms.jsx';
// Importa Nav e Footer quando os tiveres

function App() {
  return (
    <>
      {/* <Nav /> */}
      
      {/* A nossa secção reutilizável! */}
      <Section 
        id="contact"
        title="Contacte-nos" 
        subtitle="Entre em contacto connosco para saber mais sobre as nossas soluções de cibersegurança."
        bgColor="bg-dark" // Podes mudar para "bg-secondary", etc.
      >
        {/* Este conteúdo passa a ser os "children" da Section */}
        <div className="row g-5 mt-2">
          {/* Lado Esquerdo */}
          <div className="col-md-6">
            <ContactInfo />
          </div>
          
          {/* Lado Direito */}
          <div className="col-md-6">
            <Forms />
          </div>
        </div>
      </Section>

      {/* Exemplo de reutilização da secção para outra coisa qualquer: */}
      {/* <Section title="Sobre Nós" bgColor="bg-black">
         <p>Conteúdo da secção sobre nós...</p>
      </Section> 
      */}

      {/* <Footer /> */}
    </>
  );
}

export default App;