import { Toast, ToastError, SwalDelete } from "../../common/js/sweet-alerts.js";

$(() => {

    /* --------- EDIT PASSWORD -------*/

    $("html").on("click", ".btn-unlock-edit", function () {
        var form = $(this).closest("form");
        let icon = $(this).find("i");

        if (icon.hasClass("active")) {
            icon.removeClass("active");
            form.find("input").attr("disabled", "disabled");
            form.find("button").attr("disabled", "disabled");
        } else {
            icon.addClass("active");

            form.find("input").removeAttr("disabled");
            form.find("button").removeAttr("disabled");
        }
    });

    const ICON_VIEW = '<i class="fa-solid fa-eye"></i>';
    const ICON_HIDE = '<i class="fa-solid fa-eye-slash"></i>';

    /* --------- CHANGE VIEW PASSWORD ----------*/

    $("html").on("click", ".change-view-password", function () {
        var iconCont = $(this).find(".input-group-text");
        var input = $(this).siblings("input");

        if (!input.attr("disabled")) {
            if (input.attr("type") === "password") {
                input.attr("type", "text");
                iconCont.html(ICON_HIDE);
            } else {
                input.attr("type", "password");
                iconCont.html(ICON_VIEW);
            }
        }
    });


    if ($("#user_password_update_form").length) {
        var updatePasswordForm = $("#user_password_update_form").validate({
            rules: {
                old_password: {
                    required: true,
                    maxlength: 255,
                },
                new_password: {
                    required: true,
                    maxlength: 255,
                    minlength: 8,
                    oneLowercase: true,
                    oneUppercase: true,
                    oneNumber: true,
                    oneSpecialChar: true,
                },
            },
            messages: {
                new_password: {
                    oneUppercase: "Ingrese al menos una mayúscula",
                    oneLowercase: "Ingrese al menos una minúscula",
                    oneNumber: "Ingrese al menos un número",
                    oneSpecialChar: "Ingrese al menos un caracter especial"
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                var form = $(form);
                var loadSpinner = form.find(".loadSpinner");

                loadSpinner.toggleClass("active");
                form.find(".btn-save").attr("disabled", "disabled");
                form.find(".error-credentials-message").addClass("hide");

                $.ajax({
                    method: form.attr("method"),
                    url: form.attr("action"),
                    data: form.serialize(),
                    dataType: "JSON",
                    success: function (data) {
                        if (data.success) {
                            let formContainer = $("#user_password_update_form");
                            formContainer.html(data.htmlForm);

                            Toast.fire({
                                icon: "success",
                                text: data.message,
                            });
                        } else {
                            form.find(".error-credentials-message").removeClass(
                                "hide"
                            );
                            form.find(".btn-save").removeAttr("disabled");
                        }
                    },
                    complete: function (data) {
                        loadSpinner.toggleClass("active");
                        updatePasswordForm.resetForm();
                        form.trigger("reset");
                    },
                    error: function (data) {
                        console.log(data);
                        ToastError.fire();
                    },
                });
            },
        });
    }
})
