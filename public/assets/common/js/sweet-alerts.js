const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const ToastError = Swal.mixin({
    icon: "error",
    text: "¡Ocurrió un error inesperado!",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const SwalDelete = Swal.mixin({
    title: "¿Estás seguro?",
    text: "¡Esta acción no podrá ser revertida!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "¡Sí!",
    cancelButtonText: "Cancelar",
    reverseButtons: false,
    cancelButtonColor: "#004f83",
    confirmButtonColor: "#5a5a5a",
});

const SwalExit = Swal.mixin({
    title: "Cerrar sesión",
    text: "¿Estás seguro que deseas cerrar sesión?",
    cancelButtonColor: "#161616",
    confirmButtonColor: "#00b4d7",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "¡Sí!",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
});

const SwalReturnMain = Swal.mixin({
    title: "Página principal",
    text: "¿Estás seguro que deseas regresar a la página principal?",
    cancelButtonColor: "#161616",
    confirmButtonColor: "#00b4d7",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "¡Sí!",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
});

export { Toast, ToastError, SwalDelete, SwalExit, SwalReturnMain };
