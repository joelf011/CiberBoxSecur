import Swal from 'sweetalert2';

/**
 * Utilitário centralizado de alertas visuais (SweetAlert2).
 * Utilizado por toda a aplicação para garantir feedback consistente ao utilizador.
 * Cada método devolve uma Promise, permitindo encadear ações após o fecho do alerta.
 */
export const Alerts = {
  // Alerta de sucesso — fecha automaticamente após 2.5 segundos para não bloquear o fluxo.
  success: (message) => {
    return Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: message,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  },

  // Alerta de erro — requer confirmação manual para o utilizador ler a mensagem.
  error: (message) => {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#0d6efd',
    });
  },

  // Diálogo de confirmação para ações destrutivas — devolve { isConfirmed: true } se o utilizador confirmar.
  confirmDelete: (message = 'Esta ação não pode ser desfeita!') => {
    return Swal.fire({
      title: 'Tens a certeza?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, eliminar',
      cancelButtonText: 'Cancelar'
    });
  }
};