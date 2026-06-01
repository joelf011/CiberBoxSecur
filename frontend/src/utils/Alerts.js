import Swal from 'sweetalert2';

export const Alerts = {
  // Sucesso
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

  // Erro
  error: (message) => {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#0d6efd',
    });
  },

  // Pergunta de Confirmação
  confirmDelete: (message = 'Esta ação não pode ser desfeita!') => {
    return Swal.fire({
      title: 'Tens a certeza?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Cor de perigo (vermelho)
      cancelButtonColor: '#6c757d',  // Cor secundária (cinza)
      confirmButtonText: 'Sim, eliminar',
      cancelButtonText: 'Cancelar'
    });
  }
};