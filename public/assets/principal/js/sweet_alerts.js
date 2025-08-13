const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const ToastError = Swal.mixin({
    icon: 'error',
    text: '¡Ocurrió un error inesperado!',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const SwalDelete = Swal.mixin({
    title: '¿Estás seguro?',
    text: "¡Esta acción no podrá ser revertida!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '¡Sí!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
})

const SwalConfirm = Swal.mixin({
    title: 'Confirmar solicitud',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
})

export { Toast, ToastError, SwalDelete, SwalConfirm }
