import Swal from 'sweetalert2';

// Configuração padrão para manter consistência visual
const MySwal = Swal.mixin({
  customClass: {
    confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mx-2',
    cancelButton: 'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mx-2'
  },
  buttonsStyling: false // Desativa o estilo padrão para usarmos classes Tailwind acima
});

export const showSuccess = (mensagem: string, titulo: string = 'Sucesso!') => {
  return MySwal.fire({
    title: titulo,
    text: mensagem,
    icon: 'success',
    confirmButtonText: 'OK',
    timer: 5000,
    timerProgressBar: true
  });
};

export const showError = (mensagem: string, titulo: string = 'Erro!') => {
  return MySwal.fire({
    title: titulo,
    text: mensagem,
    icon: 'error',
    confirmButtonText: 'Fechar'
  });
};

export const showConfirm = (mensagem: string, titulo: string = 'Tem certeza?') => {
  return MySwal.fire({
    title: titulo,
    text: mensagem,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  });
};