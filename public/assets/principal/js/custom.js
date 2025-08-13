import { dateRangeConfig, InitAjaxSelect2 } from "./utils.js";
import DataTableEs from "./datatable_es.js";
import { Toast, ToastError, SwalDelete, SwalConfirm } from './sweet_alerts.js'

$(() => {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function validateInputForm(form) {
        var passValidation = true
        form.find('.required-input').each(function () {
            $(this).removeClass('required');
            if ($(this).val() == '') {
                $(this).addClass('required');
                passValidation = false;
            }
        })

        return passValidation;
    }

    function validateInput() {
        var passValidation = true;

        $('.required-input').each(function () {
            $(this).removeClass('required');
            if ($(this).val() == '') {
                $(this).addClass('required');
                passValidation = false;
            }
        })

        return passValidation;
    }

    function showInvalidateMessage() {
        Swal.fire({
            toast: true,
            icon: 'warning',
            title: 'Advertencia',
            text: '¡Rellena el formulario para continuar!',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    /*--------------- USERS ---------------*/

    if ($('#users-table').length) {
        var usersTableEle = $('#users-table');
        var getDataUrl = usersTableEle.data('url');
        var usersTable = usersTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            // serverSide: true,
            // processing: true,
            ajax: getDataUrl,
            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name' },
                { data: 'dni', name: 'dni' },
                { data: 'phone', name: 'phone' },
                // { data: 'user_name', name: 'user_name' },
                // { data: 'comment', name: 'comment' },
                { data: 'company', name: 'company' },
                { data: 'role.name', name: 'role.name' },
                { data: 'status', name: 'status' },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
            ],
            // columnDefs: [
            //     { 'visible': false, 'targets': [5] }
            // ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)',
                        format: {
                            body: function (data, row, column, node) {
                                // return data;
                                // if(column === 6){
                                //     return data.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "")
                                // }else{

                                return data.toString().replace(/<br>/g, ', \n').replace(/(&nbsp;|<([^>]+)>)/ig, "")
                                // }
                            }
                        },
                    },
                    title: 'USUARIOS_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'usuarios-general_' + moment().format("YY-MM-DD_hh-mm-ss"),

                }
            ],
        });

        /* --------  REGISTER USER ---------*/

        if ($('#registerProfileSelect').length) {
            var userRegisterSelect = $('#registerProfileSelect');
            userRegisterSelect.select2({
                dropdownParent: $("#registerUserForm"),
                placeholder: 'Selecciona un perfil'
            });

            var userCompanySelect = $('#registerCompanySelect');
            userCompanySelect.select2({
                dropdownParent: $("#registerUserForm"),
                placeholder: 'Selecciona una empresa',
                // closeOnSelect: false,
            })

            var selectCompanyCont = $('#select-company-container-register')

            userRegisterSelect.on('change', function () {
                let modal = $('#RegisterUserModal')

                if ($('#RegisterUserModal').hasClass('show')) {
                    var value_id = $(this).val();
                    var url = $(this).data('url');

                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: {
                            id: value_id,
                            // company_id: userCompanySelect.val(),
                            type: 'approving'
                        },
                        dataType: 'JSON',
                        success: function (data) {
                            selectCompanyCont.html('')

                            if (data.valid == 'applicant') {
                                if (!($('#selectApprovingsRegister').length)) {
                                    $('#selects-container-register').
                                        append('<div class="form-group col-md-12" id="selectApprovingsRegister"> \
                                                <label> Aprobantes (opcional)</label> \
                                                <select name="id_approvings[]" class="form-control select2" \
                                                    multiple="multiple" id="registerApprovingsSelect"> \
                                                </select> \
                                            </div>');
                                    var selectApprovings = $('#registerApprovingsSelect')
                                    selectApprovings.select2({
                                        dropdownParent: $("#registerUserForm"),
                                        placeholder: 'Selecciona un aprobante',
                                        closeOnSelect: false
                                    })
                                    selectApprovings.append('<option value=""></option>');
                                    // if(data['approvings'] != null)
                                    // {
                                    //     $.each( data['approvings'], function( key, value ) {
                                    //         selectApprovings.append('<option value="'+value['id']+'">'+value['name']+'</option>');
                                    //     })
                                    // }
                                }

                            } else {
                                $('#selectApprovingsRegister').remove();
                            }

                            if (data.valid == 'approver') {
                                selectCompanyCont.html('<select data-url="' + url + '" name="id_user_company[]" \
                                                            class="form-control select2" id="registerCompanySelect" required multiple> \
                                                            <option></option>\
                                                        </select>')

                                var userCompanySelectGen = $('#registerCompanySelect');
                                userCompanySelectGen.select2({
                                    dropdownParent: $("#registerUserForm"),
                                    placeholder: 'Selecciona una o más empresas',
                                    closeOnSelect: false
                                })

                                let inputEmail = modal.find('input[name=email]')
                                inputEmail.attr('required', 'required')
                                modal.find('label[for=inputEmail]').html('Email *')

                            } else {
                                selectCompanyCont.html('<select data-url="' + url + '" name="id_user_company" \
                                                            class="form-control select2" id="registerCompanySelect" required> \
                                                            <option></option>\
                                                        </select>')

                                var userCompanySelectGen = $('#registerCompanySelect');
                                userCompanySelectGen.select2({
                                    dropdownParent: $("#registerUserForm"),
                                    placeholder: 'Selecciona una empresa',
                                })

                                let inputEmail = modal.find('input[name=email]')
                                inputEmail.removeAttr('required')
                                modal.find('label[for=inputEmail]').html('Email (opcional)')
                            }

                            $.each(data.companies, function (key, values) {
                                userCompanySelectGen.append('<option value="' + values.id + '"> ' + values.name + ' </option>');
                            })

                            if (data['validManager'] == true) {
                                $('#image-upload-register').removeAttr('required')
                                modal.find('.info-signature-required').html('(opcional)')
                            } else {
                                $('#image-upload-register').prop('required', 'true')
                                modal.find('.info-signature-required').html('*')
                            }
                        },
                        error: function (data) {
                            ToastError.fire()
                        }
                    });
                }
            })

            // var userCompanySelectGen = $('#registerCompanySelect')
            $('body').on('change', '#registerCompanySelect', function () {

                if ($('#RegisterUserModal').hasClass('show')) {

                    if ($('#selectApprovingsRegister').length) {
                        var company_id = $(this).val();
                        var url = $(this).data('url');
                        var selectApprovings = $('#registerApprovingsSelect')
                        selectApprovings.html('');
                        $.ajax({
                            type: 'GET',
                            url: url,
                            data: {
                                id: company_id,
                                type: 'company'
                            },
                            dataType: 'JSON',
                            success: function (data) {

                                selectApprovings.append('<option></option>');
                                $.each(data['approvings'], function (key, value) {
                                    selectApprovings.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                                })
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });
                    }
                }
            })
        }

        $('#register-user-status-checkbox').change(function () {
            var txtDesc = $('#txt-register-description-user');
            if (this.checked) {
                txtDesc.html('Activo');
            } else {
                txtDesc.html('Inactivo')
            }
        });


        $('#registerUserForm').on('submit', function (e) {
            e.preventDefault();

            var loadSpinner = $(this).find('.loadSpinner');
            var img_holder = $(this).find('.img-signature-holder');

            loadSpinner.toggleClass('active');

            var form = this;
            var formData = new FormData($(form)[0]);
            $.ajax({
                url: $(form).attr('action'),
                method: $(form).attr('method'),
                data: formData,
                processData: false,
                dataType: 'JSON',
                contentType: false,
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Usuario registrado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    $(img_holder).empty();

                    $('#registerUserForm').trigger('reset');
                    $('#RegisterUserModal').modal('hide');

                    $('#registerProfileSelect').val('').trigger('change');

                    $('#select-company-container-register').html('<select data-url="" name="id_user_company" \
                                                                    class="form-control select2" id="registerCompanySelect" required> \
                                                                    <option></option>\
                                                                </select>');
                    var userCompanySelectGen = $('#registerCompanySelect');
                    userCompanySelectGen.select2({
                        dropdownParent: $("#registerUserForm"),
                        placeholder: 'Selecciona una empresa',
                    })

                    if ($('#selectApprovingsRegister').length) {
                        $('#selectApprovingsRegister').remove();
                    }

                    usersTable.ajax.reload(null, false);
                },
                complete: function (data) {
                    loadSpinner.toggleClass('active');
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        });

        var inputSignatureRegister = $('input[type="file"][name="userImageSignatureRegister"]');
        inputSignatureRegister.val('');
        inputSignatureRegister.on("change", function () {
            var img_path = $(this)[0].value;
            var img_holder = $(this).closest('#registerUserForm').find('.img-signature-holder');
            var img_extension = img_path.substring(img_path.lastIndexOf('.') + 1).toLowerCase();

            if (img_extension == 'jpeg' || img_extension == 'jpg' || img_extension == 'png') {
                if (typeof (FileReader) != 'undefined') {
                    img_holder.empty()
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('<img/>', { 'src': e.target.result, 'class': 'img-fluid signature_img' }).
                            appendTo(img_holder);
                    }
                    img_holder.show();
                    reader.readAsDataURL($(this)[0].files[0]);
                } else {
                    $(img_holder).html('Este navegador no soporta Lector de Archivos');
                }
            } else {
                inputSignatureRegister.val('')
                $(img_holder).empty();
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: '¡Selecciona una imagen!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        })


        /* ------ DELETE -------*/

        $('.main-content').on('click', '.deleteUser', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success === true) {
                                usersTable.ajax.reload(null, false);
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: '¡Ocurrió un error inesperado!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })


        /* -------------- EDIT USER ------------*/

        var userEditCompanySelect = $('#editCompanySelect');
        userEditCompanySelect.select2({
            dropdownParent: $("#EditUserForm"),
            placeholder: 'Selecciona una empresa',
            // closeOnSelect: false,
        })

        $('#edit-user-status-checkbox').change(function () {
            var txtDesc = $('#txt-edit-description-user');
            if (this.checked) {
                txtDesc.html('Activo');
            } else {
                txtDesc.html('Inactivo')
            }
        });


        $('html').on('click', '.editUser', function (e) {
            e.preventDefault();
            var url = $(this).data('url');
            var getDataUrl = $(this).data('send');
            var modal = $('#EditUserModal');
            var profileShow = modal.find('#profile-show-edit');
            modal.find('#image-signature-edit').remove();
            modal.find('#EditUserForm').attr('action', url);
            profileShow.html('');

            modal.find('#inputPasswordEdit').val('');

            userEditCompanySelect.html('').attr('name', 'id_user_company')
            userEditCompanySelect.select2({
                dropdownParent: $("#EditUserForm"),
                placeholder: 'Selecciona una empresa',
                multiple: false
                // closeOnSelect: false,
            })

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    var status = data.status;
                    let inputEmail = modal.find('input[name=email]')
                    let selectedCompaniesArray = data.selectedCompanies

                    let companiesIds = $.map(selectedCompaniesArray, function (value, i) {
                        return value.id
                    })

                    if (data.validApplicant == 'applicant') {
                        $('#selects-container-edit').
                            append('<div class="form-group col-md-12" id="selectApprovingsEdit"> \
                                    <label> Aprobantes (opcional)</label> \
                                    <select name="id_approvings[]" class="form-control select2" \
                                        multiple="multiple" id="editApprovingsSelect"> \
                                    </select> \
                                </div>');
                        var selectApprovings = $('#editApprovingsSelect');
                        selectApprovings.select2({
                            dropdownParent: $("#EditUserForm"),
                            placeholder: 'Selecciona un aprobante',
                            closeOnSelect: false
                        })
                        selectApprovings.append('<option></option>');
                        $.each(data['approvings'], function (key, value) {
                            selectApprovings.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                        })
                        selectApprovings.val(data['selectedApprovings']).change();
                    }
                    else {
                        if ($('#selectApprovingsEdit').length) {
                            $('#selectApprovingsEdit').remove();
                        }
                    }

                    if (data.validApplicant == 'approver') {
                        inputEmail.attr('required', 'required')
                        modal.find('label[for=inputEmail]').html('Email *')

                        userEditCompanySelect.attr('name', 'id_user_company[]')

                        userEditCompanySelect.select2({
                            dropdownParent: $("#EditUserForm"),
                            placeholder: 'Selecciona una o más empresa',
                            closeOnSelect: false,
                            multiple: true
                        })
                    }
                    else {
                        inputEmail.removeAttr('required')
                        modal.find('label[for=inputEmail]').html('Email (opcional)')
                    }


                    modal.find('#inputUserName').val(data.username);
                    modal.find('#inputName').val(data.name);
                    modal.find('input[name=dni]').val(data.dni)
                    modal.find('#inputEmail').val(data.email);
                    modal.find('#inputPhone').val(data.phone);
                    modal.find('#inputComment').val(data.comment);
                    modal.find('#txt-last-login').html(data.last_login);
                    modal.find('.img-signature-holder').html('<img class="img-fluid signature_img" id="image-signature-edit" src="' + data.url_signature + '"></img>');
                    modal.find('#image-upload-edit').attr('data-value', '<img scr="' + data.url_signature + '" class="img-fluid signature_img"');
                    modal.find('#image-upload-edit').val('');
                    profileShow.html(data.profile);

                    userEditCompanySelect.append('<option></option>')
                    $.each(data.companies, function (key, value) {
                        userEditCompanySelect.append('<option value="' + value.id + '">' + value.name + '</option>')
                    })

                    userEditCompanySelect.val(companiesIds).change()

                    if (status == 1) {
                        modal.find('#edit-user-status-checkbox').prop('checked', true)
                        $('#txt-edit-description-user').html('Activo')
                    } else {
                        modal.find('#edit-user-status-checkbox').prop('checked', false)
                        $('#txt-edit-description-user').html('Inactivo')
                    }

                    if (data.is_admin == true) {
                        modal.find('#edit-user-status-checkbox').prop('disabled', true)
                        modal.find('.custom-switch-indicator').addClass('disabled')
                    } else {
                        modal.find('#edit-user-status-checkbox').prop('disabled', false)
                        modal.find('.custom-switch-indicator').removeClass('disabled')
                    }
                },
                error: function (data) {
                    console.log(data)
                },
                complete: function (data) {
                    modal.modal('show');
                }
            });
        });


        var inputSignatureEdit = $('input[type="file"][name="userImageSignatureEdit"]');
        inputSignatureEdit.val('')
        inputSignatureEdit.on("change", function () {
            var img_path = $(this)[0].value;
            var img_holder = $(this).closest('#EditUserForm').find('.img-signature-holder');
            var currentImagePath = $(this).data('value');
            var img_extension = img_path.substring(img_path.lastIndexOf('.') + 1).toLowerCase();

            if (img_extension == 'jpeg' || img_extension == 'jpg' || img_extension == 'png') {
                if (typeof (FileReader) != 'undefined') {
                    img_holder.empty()
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('<img/>', { 'src': e.target.result, 'class': 'img-fluid signature_img' }).
                            appendTo(img_holder);
                    }
                    img_holder.show();
                    reader.readAsDataURL($(this)[0].files[0]);
                } else {
                    $(img_holder).html('Este navegador no soporta Lector de Archivos');
                }
            } else {
                inputSignatureEdit.val('')
                $(img_holder).html(currentImagePath);
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: '¡Selecciona una imagen!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }

        })


        $('#EditUserForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: new FormData($(form)[0]),
                processData: false,
                dataType: 'JSON',
                contentType: false,
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Usuario actualizado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    $('#EditUserModal').modal('hide');
                    usersTable.ajax.reload(null, false);
                },
                complete: function (data) {
                    loadSpinner.toggleClass('active');
                },
                error: function (data) {
                    console.log('Error', data)
                },
            })
        })


        $('#EditUserModal').on('hide.bs.modal', function (e) {
            if ($('#selectApprovingsEdit').length) {
                $('#selectApprovingsEdit').remove();
            }
        })

    }


    /* --------- WAREHOUSES GENERAL -------*/


    if ($('#warehouses-table').length) {

        /* ----- WAREHOUSE TABLE ------*/

        if ($('#registerLotSelect').length) {
            $('#registerLotSelect').select2({
                dropdownParent: $("#registerWarehouseForm"),
                placeholder: 'Selecciona un lote'
            });

            // $('#registerStageSelect').select2({
            //     dropdownParent: $("#registerWarehouseForm"),
            //     placeholder: 'Selecciona una etapa'
            // });

            $('#registerLocationSelect').select2({
                dropdownParent: $("#registerWarehouseForm"),
                placeholder: 'Selecciona una locación'
            });

            $('#registerProjectSelect').select2({
                dropdownParent: $("#registerWarehouseForm"),
                placeholder: 'Selecciona una área / proyecto'
            });

            $('#registerCompanySelect').select2({
                dropdownParent: $("#registerWarehouseForm"),
                placeholder: 'Selecciona una empresa'
            });

            // $('#registerFrontSelect').select2({
            //     dropdownParent: $("#registerWarehouseForm"),
            //     placeholder: 'Selecciona un frente'
            // });

            $('#editLotSelect').select2({
                dropdownParent: $("#editWarehouseForm"),
                placeholder: 'Selecciona un lote'
            });

            // $('#editStageSelect').select2({
            //     dropdownParent: $("#editWarehouseForm"),
            //     placeholder: 'Selecciona una etapa'
            // });

            $('#editLocationSelect').select2({
                dropdownParent: $("#editWarehouseForm"),
                placeholder: 'Selecciona una locación'
            });

            $('#editProjectSelect').select2({
                dropdownParent: $("#editWarehouseForm"),
                placeholder: 'Selecciona una área / proyecto'
            });

            $('#editCompanySelect').select2({
                dropdownParent: $("#editWarehouseForm"),
                placeholder: 'Selecciona una empresa'
            });

            // $('#editFrontSelect').select2({
            //     dropdownParent: $("#editWarehouseForm"),
            //     placeholder: 'Selecciona un frente'
            // });
        }

        var warehousesTableEle = $('#warehouses-table');
        var getDataWarehouseUrl = warehousesTableEle.data('url');
        var warehousesTable = warehousesTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            // serverSide: true,
            // processing: true,
            ajax: {
                "url": getDataWarehouseUrl,
                "data": {
                    "table": "warehouse"
                }
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name' },
                { data: 'lot.name', name: 'lot.name' },
                // { data: 'stage.name', name: 'stage.name' },
                { data: 'location.name', name: 'location.name' },
                { data: 'activity', name: 'activity' },
                { data: 'project_area.name', name: 'projectArea.name' },
                { data: 'company.name', name: 'company.name' },
                // { data: 'front.name', name: 'front.name' },
                { data: 'code', name: 'code' },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
            ],
            // columnDefs : [
            //     { 'visible': false, 'targets': [6] }
            // ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)'
                    },
                    title: 'PUNTOS VERDES_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'puntos-verdes_' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        });

        $('#registerActivitySelect').select2({
            dropdownParent: $("#registerWarehouseForm"),
            placeholder: 'Selecciona una actividad'
        })

        $('#registerWarehouseBtn').on('click', function (e) {
            var modal = $('#RegisterWarehouseModal');
            var lotSelect = modal.find('#registerLotSelect');
            var stageSelect = modal.find('#registerStageSelect');
            var locationSelect = modal.find('#registerLocationSelect');
            var projectSelect = modal.find('#registerProjectSelect');
            var companySelect = modal.find('#registerCompanySelect');
            var frontSelect = modal.find('#registerFrontSelect');
            var button = $(this);
            var url = button.data('url');
            var spinner = button.find('.loadSpinner');
            spinner.toggleClass('active');
            lotSelect.html('');
            stageSelect.html('');
            locationSelect.html('');
            projectSelect.html('');
            companySelect.html('');
            frontSelect.html('');
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'JSON',
                success: function (data) {

                    // $.each(data.)

                    lotSelect.append('<option value=""></option>')
                    $.each(data['lots'], function (key, value) {
                        lotSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    stageSelect.append('<option value=""></option>')
                    $.each(data['stages'], function (key, value) {
                        stageSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    locationSelect.append('<option value=""></option>')
                    $.each(data['locations'], function (key, value) {
                        locationSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    projectSelect.append('<option value=""></option>')
                    $.each(data['projects'], function (key, value) {
                        projectSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    companySelect.append('<option value=""></option>')
                    $.each(data['companies'], function (key, value) {
                        companySelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    frontSelect.append('<option value=""></option>')
                    $.each(data['fronts'], function (key, value) {
                        frontSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    spinner.toggleClass('active');
                    modal.modal('show');
                }
            })
        })

        const registerWarehouseForm = $('#registerWarehouseForm').validate({
            rules: {
                name: {
                    required: true,
                    maxlength: 255,
                    remote: {
                        url: $('#registerWarehouseForm').data('validate'),
                        method: $('#registerWarehouseForm').attr('method'),
                        dataType: "JSON",
                        data: {
                            name: function () {
                                return $('#registerWarehouseForm').find('input[name=name]').val()
                            }
                        }
                    }
                },
                code: {
                    required: true,
                    maxlength: 255
                },
                activity: {
                    required: true,
                },
                id_lot: {
                    required: true,
                },
                // id_stage: {
                //     required: true,
                // },
                id_project_area: {
                    required: true
                },
                id_company: {
                    required: true
                },
                // id_front: {
                //     required: true
                // }
            },
            messages: {
                name: {
                    remote: "Este nombre ya está registrado"
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                var form = $(form)
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                // form.submit();

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (e) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Punto verde registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });
                        $('#RegisterWarehouseModal').modal('hide')
                        warehousesTable.ajax.reload();
                    },
                    complete: function (data) {
                        loadSpinner.toggleClass('active');
                    }
                })
            }
        })


        // $('#btn-save-warehouse').on('click', function (e) {
        //     e.preventDefault();
        //     var form = $('#registerWarehouseForm');
        //     var passValidation = true;

        //     form.find('.required-input').each(function () {
        //         $(this).removeClass('required');
        //         if ($(this).val() == '') {
        //             $(this).addClass('required');
        //             passValidation = false;
        //         }
        //     })

        //     if (passValidation) {
        //         var loadSpinner = form.find('.loadSpinner');
        //         loadSpinner.toggleClass('active');
        //         var formData = form.serialize();
        //         $.ajax({
        //             url: form.attr('action'),
        //             method: form.attr('method'),
        //             data: formData,
        //             dataType: 'JSON',
        //             success: function (e) {
        //                 Swal.fire({
        //                     toast: true,
        //                     icon: 'success',
        //                     title: '¡Punto verde registrado exitosamente!',
        //                     position: 'top-end',
        //                     showConfirmButton: false,
        //                     timer: 3000,
        //                     timerProgressBar: true,
        //                     didOpen: (toast) => {
        //                         toast.addEventListener('mouseenter', Swal.stopTimer)
        //                         toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                     }
        //                 });
        //                 loadSpinner.toggleClass('active');
        //                 $('#RegisterWarehouseModal').modal('hide')
        //                 warehousesTable.ajax.reload();
        //             }
        //         })
        //     }
        //     else {
        //         showInvalidateMessage();
        //     }
        // })


        $('#editActivitySelect').select2({
            dropdownParent: $("#editWarehouseForm"),
            placeholder: 'Selecciona una actividad'
        })


        $('html').on('click', '.editWarehouse', function () {
            var getDataUrl = $(this).data('send');
            var url = $(this).data('url');
            var urlValidate = $(this).data('id');
            var modal = $('#EditWarehouseModal');
            var lotSelect = modal.find('#editLotSelect');
            var stageSelect = modal.find('#editStageSelect');
            var locationSelect = modal.find('#editLocationSelect');
            var projectSelect = modal.find('#editProjectSelect');
            var companySelect = modal.find('#editCompanySelect');
            var frontSelect = modal.find('#editFrontSelect');
            var activitySelect = modal.find('#editActivitySelect')

            lotSelect.html('');
            stageSelect.html('');
            locationSelect.html('');
            projectSelect.html('');
            companySelect.html('');
            frontSelect.html('');

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    lotSelect.append('<option value=""></option>')
                    $.each(data['lots'], function (key, value) {
                        lotSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    stageSelect.append('<option value=""></option>')
                    $.each(data['stages'], function (key, value) {
                        stageSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    locationSelect.append('<option value=""></option>')
                    $.each(data['locations'], function (key, value) {
                        locationSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    projectSelect.append('<option value=""></option>')
                    $.each(data['projects'], function (key, value) {
                        projectSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    companySelect.append('<option value=""></option>')
                    $.each(data['companies'], function (key, value) {
                        companySelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });
                    frontSelect.append('<option value=""></option>')
                    $.each(data['fronts'], function (key, value) {
                        frontSelect.append('<option value="' + value['id'] + '">' + value['name'] + '</option>');
                    });

                    let warehouse = data.warehouse

                    $.each(warehouse, function (key, value) {
                        let input = modal.find(`input[name=${key}]`)
                        if (input.length) {
                            input.val(value)
                        }
                    })

                    lotSelect.val(warehouse.id_lot).change();
                    stageSelect.val(warehouse.id_stage).change();
                    locationSelect.val(warehouse.id_location).change();
                    projectSelect.val(warehouse.id_project_area).change();
                    companySelect.val(warehouse.id_company).change();
                    frontSelect.val(warehouse.id_front).change();
                    activitySelect.val(warehouse.activity).trigger('change');

                    modal.modal('show');
                }
            });

            $('#editWarehouseForm').attr('action', url)
            $('#editWarehouseForm').attr('data-id', urlValidate)
        });

        const editWarehouseForm = $('#editWarehouseForm').validate({
            rules: {
                name: {
                    required: true,
                    maxlength: 255,
                    remote: {
                        url: $('#editWarehouseForm').data('validate'),
                        method: $('#editWarehouseForm').attr('method'),
                        dataType: "JSON",
                        data: {
                            name: function () {
                                return $('#editWarehouseForm').find('input[name=name]').val()
                            },
                            id: function () {
                                return $('#editWarehouseForm').attr('data-id')
                            }
                        }
                    }
                },
                code: {
                    required: true,
                    maxlength: 255
                },
                activity: {
                    required: true,
                },
                id_lot: {
                    required: true,
                },
                // id_stage: {
                //     required: true,
                // },
                id_project_area: {
                    required: true
                },
                id_company: {
                    required: true
                },
                // id_front: {
                //     required: true
                // }
            },
            messages: {
                name: {
                    remote: "Este nombre ya está registrado"
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                var form = $(form)

                var loadSpinner = form.find('.loadSpinner')
                loadSpinner.toggleClass('active');

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: form.serialize(),
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Punto verde actualizado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });
                        $('#EditWarehouseModal').modal('hide');
                        warehousesTable.ajax.reload(null, false)
                    },
                    complete: function (data) {
                        loadSpinner.toggleClass('active');
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
        })


        // $('#editWarehouseForm').on('submit', function (e) {
        //     e.preventDefault();
        //     var loadSpinner = $(this).find('.loadSpinner')
        //     loadSpinner.toggleClass('active');
        //     var form = $(this);

        //     $.ajax({
        //         url: $(this).attr('action'),
        //         method: $(this).attr('method'),
        //         data: $(form).serialize(),
        //         dataType: 'JSON',
        //         success: function (data) {
        //             Swal.fire({
        //                 toast: true,
        //                 icon: 'success',
        //                 title: '¡Punto verde actualizado exitosamente!',
        //                 position: 'top-end',
        //                 showConfirmButton: false,
        //                 timer: 3000,
        //                 timerProgressBar: true,
        //                 didOpen: (toast) => {
        //                     toast.addEventListener('mouseenter', Swal.stopTimer)
        //                     toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                 }
        //             });
        //             loadSpinner.toggleClass('active');
        //             $('#EditWarehouseModal').modal('hide');
        //             warehousesTable.ajax.reload();
        //         },
        //         error: function (data) {
        //             console.log('Error', data)
        //         }
        //     })
        // })

        $('html').on('click', '.deleteWarehouse', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                warehousesTable.ajax.reload(null, false);
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este punto de acopio está relacionado a una guía de internamiento',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        });

        /*--------- LOT TABLE -----------*/


        var lotsTable;

        $('#lots-tab').on('click', function () {

            if (!($('#lots-table_wrapper').length)) {
                var lotsTableEle = $('#lots-table');
                var getDataLotsUrl = lotsTableEle.data('url');
                lotsTable = lotsTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataLotsUrl,
                        "data": {
                            "table": "lot"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'LOTES_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'lotes_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        $('#RegisterLotsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerLotForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-lot').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerLotForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterLotsModal').modal('hide');

                        lotsTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })

        $('#EditLotModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputName').val(data.name);
                }
            });

            modal.find('#editLotsForm').attr('action', url);
        })

        $('#editLotsForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Lote actualizado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditLotModal').modal('hide');
                    lotsTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('.main-content').on('click', '.deleteLot', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                lotsTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este Lote está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        /* -------- STAGE TABLE -----------*/

        var stagesTable;

        $('#stages-tab').on('click', function () {

            if (!($('#stage-table_wrapper').length)) {
                var stageTableEle = $('#stage-table');
                var getDataStagesUrl = stageTableEle.data('url');
                stagesTable = stageTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataStagesUrl,
                        "data": {
                            "table": "stage"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'ETAPAS_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'etapas_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        $('#RegisterStagesModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerStageForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-stage').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerStageForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterStagesModal').modal('hide');

                        stagesTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })

        $('#EditStageModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputStageName').val(data.name);
                }
            });

            modal.find('#editStageForm').attr('action', url);
        })

        $('#editStageForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Etapa actualizada exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditStageModal').modal('hide');
                    stagesTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('.main-content').on('click', '.deleteStage', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                stagesTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este registro está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        /* ----------- LOCATION TABLE --------*/

        var locationsTable;

        $('#locations-tab').on('click', function () {

            if (!($('#location-table_wrapper').length)) {
                var locationTableEle = $('#location-table');
                var getDataLocationsUrl = locationTableEle.data('url');
                locationsTable = locationTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataLocationsUrl,
                        "data": {
                            "table": "location"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'Locaciones_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'locaciones_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        $('#RegisterLocationsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerLocationForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-location').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerLocationForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterLocationsModal').modal('hide');

                        locationsTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })

        $('#EditLocationModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputLocationName').val(data.name);
                }
            });

            modal.find('#editLocationForm').attr('action', url);
        })
        $('#editLocationForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Locación actualizada exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditLocationModal').modal('hide');
                    locationsTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('.main-content').on('click', '.deleteLocation', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                locationsTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este registro está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        /* ------------  PROJECT TABLE -------------*/

        var projectTable;

        $('#projects-tab').on('click', function () {

            if (!($('#project-table_wrapper').length)) {
                var projectTableEle = $('#project-table');
                var getDataProjectsUrl = projectTableEle.data('url');
                projectTable = projectTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataProjectsUrl,
                        "data": {
                            "table": "project"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'ÁREA-PROYECTO_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'area-proyecto_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        $('#RegisterProjectsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerProjectForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-project').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerProjectForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterProjectsModal').modal('hide');

                        projectTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })


        $('#EditProjectModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputProjectName').val(data.name);
                }
            });

            modal.find('#editProjectForm').attr('action', url);
        })

        $('#editProjectForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Área de proyecto actualizada exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditProjectModal').modal('hide');
                    projectTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('.main-content').on('click', '.deleteProject', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                projectTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este registro está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })


        /* ------------ COMPANY TABLE -------------*/

        var companyTable;

        $('#companies-tab').on('click', function () {

            if (!($('#company-table_wrapper').length)) {
                var companyTableEle = $('#company-table');
                var getDataCompanysUrl = companyTableEle.data('url');
                companyTable = companyTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataCompanysUrl,
                        "data": {
                            "table": "company"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'ruc', name: 'ruc' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'EMPRESAS_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'empresas_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })


        $('#RegisterCompaniesModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerCompanyForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-company').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerCompanyForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterCompaniesModal').modal('hide');

                        companyTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })

        $('#EditCompanyModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputCompanyName').val(data.name);
                    modal.find('#inputCompanyRuc').val(data.ruc);
                }
            });
            modal.find('#editCompanyForm').attr('action', url);
        })

        $('#editCompanyForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Empresa actualizada exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditCompanyModal').modal('hide');
                    companyTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('.main-content').on('click', '.deleteCompany', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                companyTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este registro está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        /* ------- FRONT TABLE -----------*/

        var frontTable;

        $('#fronts-tab').on('click', function () {

            if (!($('#front-table_wrapper').length)) {
                var frontTableEle = $('#front-table');
                var getDataFrontsUrl = frontTableEle.data('url');
                frontTable = frontTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDataFrontsUrl,
                        "data": {
                            "table": "front"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name' },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)'
                            },
                            title: 'FRENTES_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'frentes_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        $('#RegisterFrontsModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var text = button.data('text');
            var placeholder = button.data('placeholder');
            var modal = $(this);
            var form = modal.find('#registerFrontForm');
            form.attr('action', url);
            modal.find('#txt-context-element').html(text);
            modal.find('#inputName').attr('placeholder', placeholder)
        })

        $('#btn-save-front').on('click', function (e) {
            e.preventDefault();
            var form = $('#registerFrontForm');

            var passValidation = true;
            form.find('.required-input').each(function () {
                $(this).removeClass('required');
                if ($(this).val() == '') {
                    $(this).addClass('required');
                    passValidation = false;
                }
            })

            if (passValidation) {
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();
                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        form.trigger('reset');
                        $('#RegisterFrontsModal').modal('hide');

                        frontTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log('Error', data)
                    }
                })
            }
            else {
                showInvalidateMessage();
            }
        })

        $('#EditFrontModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var url = button.data('url');
            var getDataUrl = button.data('send');
            var modal = $(this);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputFrontName').val(data.name);
                }
            });
            modal.find('#editFrontForm').attr('action', url);
        })

        $('#editFrontForm').on('submit', function (e) {
            e.preventDefault();
            var loadSpinner = $(this).find('.loadSpinner')
            loadSpinner.toggleClass('active');
            var form = this;

            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(form).serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Frente actualizado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    loadSpinner.toggleClass('active');
                    $('#EditFrontModal').modal('hide');
                    frontTable.ajax.reload();
                },
                error: function (data) {
                    console.log('Error', data)
                }
            })
        })

        $('html').on('click', '.deleteFront', function () {
            var url = $(this).data('url');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                frontTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: 'Error: Este registro está relacionado a un punto de acopio',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })
    }




    /* ------------- WASTE CLASSES --------*/

    if ($('#waste-class-table').length) {
        var wasteClassTableEle = $('#waste-class-table');
        var getDataUrl = wasteClassTableEle.data('url');
        var wasteClassTable = wasteClassTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            // serverSide: true,
            // processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "class"
                }
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'group.name', name: 'group.name' },
                { data: 'status.name', name: 'status.name' },
                { data: 'symbol', name: 'symbol' },
                // { data: 'name', name: 'name' },
                { data: 'types', name: 'types', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col' },
            ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        format: {
                            body: function (data, row, column, node) {
                                return data.toString().replace(/<br>/g, ', \n')
                            }
                        },
                        columns: ':not(.not-export-col)',
                    },
                    title: 'CLASES DE RESIDUO_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'clases-de-residuo_' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        });

        var selectGroups = $('#registerGroupSelect');
        var selectStatus = $('#registerStatusSelect');

        selectGroups.select2({
            placeholder: 'Selecciona un grupo'
        })
        selectStatus.select2({
            placeholder: 'Selecciona un estado'
        })

        $('#register-wasteClass-btn').on('click', function (e) {
            var button = $(this);
            var url = button.data('url');
            var modal = $('#RegisterClassModal');
            var selectTypes = $('#registerWasteTypesSelect');

            var spinner = button.find('.loadSpinner');
            spinner.toggleClass('active');
            selectTypes.html('')
            selectGroups.html('')
            selectStatus.html('')

            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'JSON',
                success: function (data) {
                    selectTypes.append('<option value=""></option>');
                    $.each(data['wasteTypes'], function (key, values) {
                        selectTypes.append('<option value="' + values.id + '">' + values.name + '</option>')
                    })

                    selectGroups.append('<option value=""></option>');
                    $.each(data['groups'], function (key, values) {
                        selectGroups.append('<option value="' + values.id + '">' + values.name + '</option>')
                    })

                    selectStatus.append('<option value=""></option>');
                    $.each(data['statuses'], function (key, values) {
                        selectStatus.append('<option value="' + values.id + '">' + values.name + '</option>')
                    })

                    spinner.toggleClass('active');
                    modal.modal('show');
                },
                error: function (data) {
                    console.log(data);
                }
            })

        })


        if ($('#registerWasteTypesSelect').length) {
            var registerWasteTypeSelect = $('#registerWasteTypesSelect');
            registerWasteTypeSelect.select2({
                dropdownParent: $("#RegisterClassModal"),
                closeOnSelect: false,
                placeholder: 'Selecciona uno o más tipos de residuo'
            });
        }

        /*------------ REGISTER CLASS -----------*/

        const registerWasteClassForm = $('#registerWasteClassForm').validate({
            rules: {
                symbol: {
                    required: true,
                    maxlength: 255,
                    remote: {
                        url: $('#registerWasteClassForm').data('validate'),
                        method: $('#registerWasteClassForm').attr('method'),
                        dataType: "JSON",
                        data: {
                            symbol: function () {
                                return $('#registerWasteClassForm').find('input[name=symbol]').val()
                            }
                        }
                    }
                },
                group_id: {
                    required: true
                },
                status_id: {
                    required: true
                },
                'id_waste_types[]': {
                    required: true
                }
            },
            messages: {
                symbol: {
                    remote: 'Esta clase ya está registrada'
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                var form = $(form)
                var loadSpinner = form.find('.loadSpinner');
                loadSpinner.toggleClass('active');
                var formData = form.serialize();

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: formData,
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Clase registrada exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        $('#registerWasteClassForm').trigger('reset');
                        $('#RegisterClassModal').modal('hide');
                        $('#registerWasteTypesSelect').val([]).trigger('change');

                        wasteClassTable.ajax.reload();
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }
        })


        /* ------------- DELETE ------------------*/

        $('html').on('click', '.deleteClass', function () {
            var url = $(this).data('url');

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {

                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success === true) {
                                wasteClassTable.ajax.reload(null, false);
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            } else {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: '¡Ocurrió un error inesperado!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })

        })

        if ($('#editWasteTypesSelect').length) {
            var editWasteTypesSelect = $('#editWasteTypesSelect');
            editWasteTypesSelect.select2({
                dropdownParent: $("#EditClassModal"),
                closeOnSelect: false,
                placeholder: 'Selecciona uno o más tipos de residuo'
            });
        }


        /* ------------- EDIT WASTE CLASS ---------------*/

        var selectEditGroups = $('#editGroupSelect');
        var selectEditStatus = $('#editStatusSelect');

        selectEditGroups.select2({
            placeholder: 'Selecciona un grupo'
        })
        selectEditStatus.select2({
            placeholder: 'Selecciona un estado'
        })


        $('html').on('click', '.editClass', function () {
            var getDataUrl = $(this).data('send');
            var url = $(this).data('url');
            var dataId = $(this).data('id');
            var modal = $('#EditClassModal');
            var selectTypes = $('#editWasteTypesSelect');
            let selectGroups = $('#editGroupSelect');
            let selectStatus = $('#editStatusSelect');

            selectTypes.html('')
            selectGroups.html('')
            selectStatus.html('')

            modal.find('#EditWasteClassForm').attr('action', url);
            modal.find('#EditWasteClassForm').attr('data-id', dataId);

            $.ajax({
                type: 'GET',
                url: getDataUrl,
                dataType: 'JSON',
                success: function (data) {
                    modal.find('#inputEditNameWasteClass').val(data.name);
                    modal.find('#inputSymbolWasteClass').val(data.symbol);

                    selectTypes.append('<option value=""></option>');
                    $.each(data['types'], function (key, value) {
                        selectTypes.append('<option value="' + value.id + '">' + value.name + '</option>')
                    })
                    selectTypes.val(data['selectedTypes']).trigger('change');

                    let wasteClass = data.class

                    selectGroups.append('<option value=""></option>');
                    $.each(data['groups'], function (key, value) {
                        selectGroups.append('<option value="' + value.id + '">' + value.name + '</option>')
                    })
                    selectGroups.val(wasteClass.group_id).trigger('change');

                    selectStatus.append('<option value=""></option>');
                    $.each(data['statuses'], function (key, value) {
                        selectStatus.append('<option value="' + value.id + '">' + value.name + '</option>')
                    })
                    selectStatus.val(wasteClass.status_id).trigger('change');

                },
                error: function (data) {
                    console.log(data)
                },
                complete: function (data) {
                    modal.modal('show');
                }
            });
        })

        // $('#EditClassModal').on('hidden.bs.modal', function (e) {
        //     $('#editWasteTypesSelect').html('');
        // })


        const editWasteClassForm = $('#EditWasteClassForm').validate({
            rules: {
                symbol: {
                    required: true,
                    maxlength: 255,
                    remote: {
                        url: $('#EditWasteClassForm').data('validate'),
                        method: $('#EditWasteClassForm').attr('method'),
                        dataType: "JSON",
                        data: {
                            symbol: function () {
                                return $('#EditWasteClassForm').find('input[name=symbol]').val()
                            },
                            id: function () {
                                return $('#EditWasteClassForm').attr('data-id')
                            }
                        }
                    }
                },
                group_id: {
                    required: true
                },
                status_id: {
                    required: true
                },
                'id_waste_types[]': {
                    required: true
                }
            },
            messages: {
                symbol: {
                    remote: 'Esta clase ya está registrada'
                }
            },
            submitHandler: function (form, event) {
                event.preventDefault();
                var form = $(form)

                var loadSpinner = form.find('.loadSpinner')
                loadSpinner.toggleClass('active');

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: form.serialize(),
                    dataType: 'JSON',
                    success: function (data) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Clase actualizada exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        loadSpinner.toggleClass('active');
                        $('#EditClassModal').modal('hide');
                        wasteClassTable.ajax.reload(null, false);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            }
        })

        /* -------------- GROUPS ---------------*/

        var groupTableEle = $('#groups-table')
        var getGroupUrl = groupTableEle.data('url');
        var groupTable = groupTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            ajax: {
                "url": getGroupUrl,
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name', className: "columnType" },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: "btnWasteType not-export-col" },
            ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)',
                    },
                    title: 'GRUPOS_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'grupos_' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        })

        /* ----------- REGISTER ------------*/

        $('#registerGroupForm').on('submit', function (e) {
            e.preventDefault();

            var loadSpinner = $(this).find('.loadSpinner');
            loadSpinner.toggleClass('active');
            var form = $(this);
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Tipo de residuo registrado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    loadSpinner.toggleClass('active');
                    $('#registerGroupForm').trigger('reset');

                    groupTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })

        })

        /* -------------- EDIT ------------ */

        $('#groups-table').on('click', '.editGroup', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-group-edit-container').remove();
            column.siblings().find('.input-group-edit').remove();

            buttons.before('<td class="input-group-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-group-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-group\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetGroupEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#groups-table').on('click', '#resetGroupEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-group-edit').remove();
            $('#form-group-edit-container').remove();
        })

        $('#groups-table').on('click', '.btn-update-group', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-group-edit input').val();
            var url = column.find('.editGroup').data('url');

            if (value.length == 0) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: '¡El campo está vacío!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
            else {
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        "value": value
                    },
                    dataType: "JSON",
                    success: function (result) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        groupTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#groups-table').on('click', '.deleteGroup', function () {
            var url = $(this).data('url');

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {

                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                groupTable.ajax.reload(null, false);
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'warning',
                                    title: '¡Este registro está relacionado a una o más clases de residuo, no se puede eliminar!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: '¡Ocurrió un error inesperado!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })


        /* ------------- WASTE TYPES -------------*/

        var wasteTypeTableEle = $('#waste-type-table');
        var getTypeUrl = wasteTypeTableEle.data('url');
        var wasteTypeTable = wasteTypeTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            // serverSide: true,
            // processing: true,
            ajax: {
                "url": getTypeUrl,
                "data": {
                    "table": "type"
                }
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name', className: "columnType" },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: "btnWasteType not-export-col" },
            ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)',
                    },
                    title: 'TIPOS DE RESIDUO_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'tipos-de-residuo_' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        })

        /* ----------- REGISTER ------------*/

        $('#registerWasteTypeForm').on('submit', function (e) {
            e.preventDefault();

            var loadSpinner = $(this).find('.loadSpinner');
            loadSpinner.toggleClass('active');
            var form = $(this);
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Tipo de residuo registrado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    loadSpinner.toggleClass('active');
                    $('#registerWasteTypeForm').trigger('reset');

                    wasteTypeTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })

        })


        /* -------------- EDIT ------------ */

        $('#waste-type-table').on('click', '.editType', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-type-edit-container').remove();
            column.siblings().find('.input-type-edit').remove();

            buttons.before('<td class="input-type-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-type-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-waste-type\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetWasteTypeEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })


        $('#waste-type-table').on('click', '#resetWasteTypeEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-type-edit').remove();
            $('#form-type-edit-container').remove();
        })

        $('#waste-type-table').on('click', '.btn-update-waste-type', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-type-edit input').val();
            var url = column.find('.editType').data('url');

            if (value.length == 0) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: '¡El campo está vacío!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
            else {
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        "value": value
                    },
                    dataType: "JSON",
                    success: function (result) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        wasteTypeTable.ajax.reload();
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });


        /*-------------- DELETE --------------*/

        $('#waste-type-table').on('click', '.deleteType', function () {
            var url = $(this).data('url');

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {

                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                wasteTypeTable.ajax.reload();
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'warning',
                                    title: '¡Este registro está relacionado a una o más clases de residuo, no se puede eliminar!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: '¡Ocurrió un error inesperado!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })


        /* -------------- STATUSES ---------------*/

        var statusTableEle = $('#status-table')
        var getStatusUrl = statusTableEle.data('url');
        var statusTable = statusTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            ajax: {
                "url": getStatusUrl,
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'name', name: 'name', className: "columnType" },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: "btnWasteType not-export-col" },
            ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)',
                    },
                    title: 'ESTADOS_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'estados_' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        })

        /* ----------- REGISTER ------------*/

        $('#registerStatusForm').on('submit', function (e) {
            e.preventDefault();

            var loadSpinner = $(this).find('.loadSpinner');
            loadSpinner.toggleClass('active');
            var form = $(this);
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    Swal.fire({
                        toast: true,
                        icon: 'success',
                        title: '¡Tipo de residuo registrado exitosamente!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    loadSpinner.toggleClass('active');
                    $('#registerStatusForm').trigger('reset');

                    statusTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })

        })

        /* -------------- EDIT ------------ */

        $('#status-table').on('click', '.editStatus', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-status-edit-container').remove();
            column.siblings().find('.input-status-edit').remove();

            buttons.before('<td class="input-status-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-status-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-status\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetStatusEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#status-table').on('click', '#resetStatusEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-status-edit').remove();
            $('#form-status-edit-container').remove();
        })

        $('#status-table').on('click', '.btn-update-status', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-status-edit input').val();
            var url = column.find('.editStatus').data('url');

            if (value.length == 0) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: '¡El campo está vacío!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
            else {
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: {
                        "value": value
                    },
                    dataType: "JSON",
                    success: function (result) {
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: '¡Registrado exitosamente!',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        statusTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#status-table').on('click', '.deleteStatus', function () {
            var url = $(this).data('url');

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no podrá ser revertida!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Sí!',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then(function (e) {

                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.success == true) {
                                statusTable.ajax.reload(null, false);
                                Swal.fire({
                                    toast: true,
                                    icon: 'success',
                                    title: 'Registro eliminado',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else if (result.success == 'invalid') {
                                Swal.fire({
                                    toast: true,
                                    icon: 'warning',
                                    title: '¡Este registro está relacionado a una o más clases de residuo, no se puede eliminar!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                            else {
                                Swal.fire({
                                    toast: true,
                                    icon: 'error',
                                    title: '¡Ocurrió un error inesperado!',
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })



        // /*---------- PACKAGE TYPES -----------*/

        // var packageTypeTableEle = $('#package-type-table');
        // var getTypeUrl = packageTypeTableEle.data('url');
        // var packageTypeTable = packageTypeTableEle.DataTable({
        //     responsive: true,
        //     language: DataTableEs,
        //     // serverSide: true,
        //     // processing: true,
        //     ajax: {
        //         "url": getTypeUrl,
        //     },
        //     columns: [
        //         { data: 'id', name: 'id' },
        //         { data: 'name', name: 'name', className: "columnType" },
        //         { data: 'action', name: 'action', orderable: false, searchable: false, className: "btnPackageType not-export-col" },
        //     ],
        //     dom: 'Bfrtlip',
        //     buttons: [
        //         {
        //             text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
        //             extend: 'excelHtml5',
        //             exportOptions: {
        //                 columns: ':not(.not-export-col)',
        //             },
        //             title: 'TIPOS DE EMBALAJE_' + moment().format("YY-MM-DD_hh-mm-ss"),
        //             filename: 'tipos-de-embalaje_' + moment().format("YY-MM-DD_hh-mm-ss"),
        //         }
        //     ],
        // })

        // /* ----------- REGISTER ------------*/

        // $('#registerPackageTypeForm').on('submit', function (e) {
        //     e.preventDefault();

        //     var loadSpinner = $(this).find('.loadSpinner');
        //     loadSpinner.toggleClass('active');
        //     var form = $(this);
        //     $.ajax({
        //         url: form.attr('action'),
        //         method: form.attr('method'),
        //         data: form.serialize(),
        //         dataType: 'JSON',
        //         success: function (data) {
        //             Swal.fire({
        //                 toast: true,
        //                 icon: 'success',
        //                 title: '¡Tipo de embalaje registrado!',
        //                 position: 'top-end',
        //                 showConfirmButton: false,
        //                 timer: 3000,
        //                 timerProgressBar: true,
        //                 didOpen: (toast) => {
        //                     toast.addEventListener('mouseenter', Swal.stopTimer)
        //                     toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                 }
        //             });

        //             loadSpinner.toggleClass('active');
        //             $('#registerPackageTypeForm').trigger('reset');

        //             packageTypeTable.ajax.reload();
        //         },
        //         error: function (data) {
        //             console.log(data);
        //         }
        //     })

        // })


        // /* -------------- EDIT ------------ */

        // $('#package-type-table').on('click', '.editType', function () {
        //     var column = $(this).closest('tr');
        //     var buttons = column.find('.btnPackageType');
        //     var tdText = column.find('.columnType');
        //     var value = tdText.text();

        //     column.addClass('edit-ready').siblings().removeClass('edit-ready');
        //     column.siblings().find('#form-package-type-edit-container').remove();
        //     column.siblings().find('.input-type-edit').remove();

        //     buttons.before('<td class="input-type-edit"> \
        //                     <input type="text" class="form-control" value="'+ value + '" required> \
        //                 </td>');

        //     column.append('<td id="form-package-type-edit-container"> \
        //                     <button type="button"\
        //                             class="me-3 edit btn btn-primary btn-sm btn-update-package-type\
        //                             "> \
        //                             <i class="fa-solid fa-floppy-disk"></i> \
        //                     </button> \
        //                     <button id="resetpackageTypeEdit"\
        //                             class="ms-3 btn btn-danger btn-sm"> \
        //                             <i class="fa-solid fa-x"></i> \
        //                     </button> \
        //                 </td>');
        // })


        // $('#package-type-table').on('click', '#resetpackageTypeEdit', function () {
        //     var column = $(this).closest('tr');
        //     column.toggleClass('edit-ready');

        //     column.find('.input-type-edit').remove();
        //     $('#form-package-type-edit-container').remove();
        // })



        // $('#package-type-table').on('click', '.btn-update-package-type', function () {
        //     var column = $(this).closest('tr');
        //     var value = column.find('.input-type-edit input').val();
        //     var url = column.find('.editType').data('url');

        //     if (value.length == 0) {
        //         Swal.fire({
        //             toast: true,
        //             icon: 'warning',
        //             title: '¡El campo está vacío!',
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 2000,
        //             timerProgressBar: true,
        //             didOpen: (toast) => {
        //                 toast.addEventListener('mouseenter', Swal.stopTimer)
        //                 toast.addEventListener('mouseleave', Swal.resumeTimer)
        //             }
        //         });
        //     }
        //     else {
        //         $.ajax({
        //             url: url,
        //             method: 'POST',
        //             data: {
        //                 "value": value
        //             },
        //             dataType: "JSON",
        //             success: function (result) {
        //                 Swal.fire({
        //                     toast: true,
        //                     icon: 'success',
        //                     title: '¡Registrado exitosamente!',
        //                     position: 'top-end',
        //                     showConfirmButton: false,
        //                     timer: 3000,
        //                     timerProgressBar: true,
        //                     didOpen: (toast) => {
        //                         toast.addEventListener('mouseenter', Swal.stopTimer)
        //                         toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                     }
        //                 });

        //                 packageTypeTable.ajax.reload();
        //             },
        //             error: function (result) {
        //                 console.log(result)
        //             }
        //         });
        //     }
        // });


        // /*-------------- DELETE --------------*/

        // $('#package-type-table').on('click', '.deleteType', function () {
        //     var url = $(this).data('url');

        //     Swal.fire({
        //         title: '¿Estás seguro?',
        //         text: "¡Esta acción no podrá ser revertida!",
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: '¡Sí!',
        //         cancelButtonText: 'Cancelar',
        //         reverseButtons: true,
        //     }).then(function (e) {

        //         if (e.value === true) {
        //             $.ajax({
        //                 type: 'DELETE',
        //                 url: url,
        //                 dataType: 'JSON',
        //                 success: function (result) {
        //                     if (result.success == true) {
        //                         packageTypeTable.ajax.reload();
        //                         Swal.fire({
        //                             toast: true,
        //                             icon: 'success',
        //                             title: 'Registro eliminado',
        //                             position: 'top-end',
        //                             showConfirmButton: false,
        //                             timer: 3000,
        //                             timerProgressBar: true,
        //                             didOpen: (toast) => {
        //                                 toast.addEventListener('mouseenter', Swal.stopTimer)
        //                                 toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                             }
        //                         });
        //                     }
        //                     else if (result.success == 'invalid') {
        //                         Swal.fire({
        //                             toast: true,
        //                             icon: 'warning',
        //                             title: '¡Este registro está relacionado a una o más guías de internamiento, no se puede eliminar!',
        //                             position: 'top-end',
        //                             showConfirmButton: false,
        //                             timer: 3000,
        //                             timerProgressBar: true,
        //                             didOpen: (toast) => {
        //                                 toast.addEventListener('mouseenter', Swal.stopTimer)
        //                                 toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                             }
        //                         });
        //                     }
        //                     else {
        //                         Swal.fire({
        //                             toast: true,
        //                             icon: 'error',
        //                             title: '¡Ocurrió un error inesperado!',
        //                             position: 'top-end',
        //                             showConfirmButton: false,
        //                             timer: 3000,
        //                             timerProgressBar: true,
        //                             didOpen: (toast) => {
        //                                 toast.addEventListener('mouseenter', Swal.stopTimer)
        //                                 toast.addEventListener('mouseleave', Swal.resumeTimer)
        //                             }
        //                         });
        //                     }
        //                 },
        //                 error: function (result) {
        //                     console.log('Error', result);
        //                 }
        //             });
        //         } else {
        //             e.dismiss;
        //         }
        //     }, function (dismiss) {
        //         return false;
        //     })
        // })
    }



    /* ------------- GUIDES ADMIN --------------*/

    if ($('#guide-approved-table-admin').length) {
        var guideAdminApprovedTableEle = $('#guide-approved-table-admin');
        var getDataUrl = guideAdminApprovedTableEle.data('url');
        var guideAdminApprovedTable = guideAdminApprovedTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "approved"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'stat_approved', name: 'stat_approved' },
                { data: 'stat_recieved', name: 'stat_recieved' },
                { data: 'stat_verified', name: 'stat_verified' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false },
            ],
            // dom: 'Bfrtlip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         title: 'GUÍAS DE INTERNAMIENTO APROBADAS_' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         filename: 'guías-de-internamiento-aprobadas' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         exportOptions: {
            //             columns: ':not(.not-export-col)'
            //         },
            //     }
            // ],
        });
    }


    if ($('#guide-pending-table-admin').length) {

        var guideAdminPendingTableEle = $('#guide-pending-table-admin');
        var getDataUrl = guideAdminPendingTableEle.data('url');
        var guideAdminPendingTable = guideAdminPendingTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "pending"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'stat_approved', name: 'stat_approved' },
                { data: 'stat_recieved', name: 'stat_recieved' },
                { data: 'stat_verified', name: 'stat_verified' },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ],
            // dom: 'Bfrtlip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         title: 'GUÍAS DE INTERNAMIENTO PENDIENTES_' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         filename: 'guías-de-internamiento-pendientes' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         exportOptions: {
            //             columns: ':not(.not-export-col)'
            //         },
            //     }
            // ],
        });


        // -------- DELETE GUIDE -----------

        $('html').on('click', '.delete-guide-btn', function (e) {
            e.preventDefault();

            var url = $(this).attr('href')

            SwalDelete.fire().then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {

                            var icon

                            if (result.success === true) {
                                guideAdminPendingTable.ajax.reload(null, false);
                                icon = 'success'
                            } else {
                                icon = 'error'
                            }

                            Toast.fire({
                                icon: icon,
                                text: result.message
                            })
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })
    }


    if ($('#guide-rejected-table-admin').length) {
        var guideAdminRejectedTableEle = $('#guide-rejected-table-admin');
        var getDataUrl = guideAdminRejectedTableEle.data('url');
        var guideAdminRejectedTable = guideAdminRejectedTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "rejected"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'stat_approved', name: 'stat_approved' },
                { data: 'stat_recieved', name: 'stat_recieved' },
                { data: 'stat_verified', name: 'stat_verified' },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'not-export-col text-nowrap' },
            ],
            // dom: 'Bfrtlip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         title: 'GUÍAS DE INTERNAMIENTO RECHAZADAS_' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         filename: 'guías-de-internamiento-rechazadas' + moment().format("YY-MM-DD_hh-mm-ss"),
            //         exportOptions: {
            //             columns: ':not(.not-export-col)'
            //         },
            //     }
            // ],
        });

        // -------- DELETE GUIDE -----------

        $('html').on('click', '.delete-guide-btn', function (e) {
            e.preventDefault();

            var url = $(this).attr('href')

            SwalDelete.fire().then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {

                            var icon

                            if (result.success === true) {
                                guideAdminRejectedTable.ajax.reload(null, false);
                                icon = 'success'
                            } else {
                                icon = 'error'
                            }

                            Toast.fire({
                                icon: icon,
                                text: result.message
                            })
                        },
                        error: function (result) {
                            console.log('Error', result);
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })
    }






    // ------- UPDATE GUIDES ADMIN ----------

    if ($('#update-guide-form').length) {

        var form = $('#update-guide-form')
        var input = form.find('input[name=date]')

        input.on('change', function (e) {
            $(this).attr('value', $(this).val())
        })

        $('#update-guide-form').on('submit', function (event) {
            event.preventDefault();

            var url = $(this).attr('action')
            var date = input.val()

            $.ajax({
                type: $(this).attr('method'),
                url: url,
                data: {
                    date: date
                },
                dataType: 'JSON',
                success: function (data) {

                    var icon = ''

                    if (data.success) {
                        icon = 'success'
                    }
                    else {
                        icon = 'error'
                    }

                    Toast.fire({
                        icon: icon,
                        text: data.message
                    })

                },
                error: function (data) {
                    console.log(data)
                }
            })


        })

    }



    // * ------- FILTROS -----------

    if ($('#waste_warehouse_select').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'warehouse'
        }
        InitAjaxSelect2(
            '#waste_warehouse_select',
            config,
            'name',
            data
        )
    }

    if ($('#waste_company_select').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'company'
        }
        InitAjaxSelect2(
            '#waste_company_select',
            config,
            'name',
            data
        )
    }

    if ($('#waste_code_select').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'code'
        }
        InitAjaxSelect2(
            '#waste_code_select',
            config,
            'code',
            data
        )
    }

    if ($('#waste_wastetype_select').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'waste'
        }
        InitAjaxSelect2(
            '#waste_wastetype_select',
            config,
            'name',
            data
        )
    }

    if ($('#waste_group_select').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'group'
        }
        InitAjaxSelect2(
            '#waste_group_select',
            config,
            'name',
            data
        )
    }

    if ($('#waste_group_select_departure').length) {
        let config = {
            placeholder: 'Todos',
            allowClear: true
        }
        let data = {
            filter: 'group'
        }
        InitAjaxSelect2(
            '#waste_group_select_departure',
            config,
            'name',
            data
        )
    }



    /*  --- GENERATED WASTES ADMIN ----------*/

    if ($('#generated-wastes-table-admin').length) {

        var generatedWastesAdminTable

        var formGeneratedWastesContainer = $('#form-generated-wastes-container')
        var filtersContainer = $('#filters-container')

        // * ----- FILTERS ---------
        var inputFromDate = formGeneratedWastesContainer.find("input[name=from_date]");
        var inputEndDate = formGeneratedWastesContainer.find("input[name=end_date]");

        var warehouseFilter = $('#waste_warehouse_select')
        var companyFilter = $('#waste_company_select')
        var codeFilter = $('#waste_code_select')
        var wasteTypeFilter = $('#waste_wastetype_select')
        var groupFilter = $('#waste_group_select')

        $('html').on('change', '.waste_internment_select', function () {
            generatedWastesAdminTable.ajax.reload()
            let select = $(this)
            let thisName = select.attr('name')
            let value = select.val()

            let inputFilter = formGeneratedWastesContainer.find(`input[name=${thisName}]`)
            if (inputFilter.length) {
                inputFilter.val(value)
            }
        })

        let input_max_date = $('input#max_date').val() // * Solo para dashboards
        let input_min_date = $('input#min_date').val()

        var containerDaterange = $('.datepicker-range-container.input-daterange')

        containerDaterange.datepicker({
            language: 'es',
            orientation: "bottom auto"
        })
        // .on('hide', function (e) {
        //     generatedWastesAdminTable.ajax.reload()
        // })

        var fromDatepickerinput = $('#fromDateSelect')
        var toDatepickerinput = $('#toDateSelect')

        containerDaterange.find('input[name=fromDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date(input_min_date))
                .on('hide', function (e) {

                    let prevValue = inputFromDate.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        generatedWastesAdminTable.ajax.reload()
                    }

                    inputFromDate.val(date)
                    inputEndDate.val(moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })
        containerDaterange.find('input[name=toDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date())
                .on('hide', function (e) {
                    // console.log(e)

                    let prevValue = inputEndDate.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    console.log(prevValue)

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        generatedWastesAdminTable.ajax.reload()
                    }

                    inputEndDate.val(date)
                    inputFromDate.val(moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })

        // * ----------- TABLE ---------------

        var generatedWastesAdminTableEle = $('#generated-wastes-table-admin');
        var getDataUrl = generatedWastesAdminTableEle.data('url');
        generatedWastesAdminTable = generatedWastesAdminTableEle.DataTable({
            order: [[2, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": function (data) {
                    data.from_date = moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD');
                    data.end_date = moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD');
                    data.warehouse = warehouseFilter.val()
                    data.company = companyFilter.val()
                    data.code = codeFilter.val()
                    data.wastetype = wasteTypeFilter.val()
                    data.group = groupFilter.val()
                }
            },
            columns: [
                { data: 'id', name: 'id' },
                { data: 'guide.code', name: 'guide.code', className: 'text-nowrap' }, // NRO GUÍA
                { data: 'guide.created_at', name: 'guide.created_at', className: 'text-nowrap' },
                { data: 'guide.warehouse.name', name: 'guide.warehouse.name' },
                { data: 'guide.warehouse.lot.name', name: 'guide.warehouse.lot.name' },
                { data: 'guide.warehouse.location.name', name: 'guide.warehouse.location.name' },
                { data: 'guide.warehouse.activity', name: 'guide.warehouse.activity' },
                { data: 'guide.warehouse.project_area.name', name: 'guide.warehouse.projectArea.name' },
                { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' },
                { data: 'guide.warehouse.code', name: 'guide.warehouse.code' },
                { data: 'waste.name', name: 'waste.name' },///  NOMBRE DE RESIDUO
                { data: 'waste.classes_wastes.symbol', name: 'waste.classesWastes.symbol', orderable: false, searchable: false }, // CLASE
                { data: 'waste.classes_wastes.group.name', name: 'waste.classesWastes.group.name', orderable: false, searchable: false }, // GRUPO
                { data: 'gestion_type', name: 'gestion_type' },///  TIPO DE GESTIÓN

                { data: 'aprox_weight', name: 'aprox_weight' },//  PESO REAL
                { data: 'action', name: 'action', className: 'action', orderable: false, searchable: false },
            ],
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         title:    function () {
            //             var from_date = $('#daterange-btn-wastes-admin').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastes-admin').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastes-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'El principio'};
            //             return 'RESIDUOS GENERADOS - ADMINISTRADOR: '+name+' - DESDE: '+from_date+ ' - ' + 'HASTA: ' + end_date;
            //         },
            //         filename: function () {
            //             var from_date = $('#daterange-btn-wastes-admin').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastes-admin').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastes-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'todos'};
            //             return 'residuos-generados_administrador-'+name+'_'+from_date+'_' + end_date + '_' + moment().format("hh-mm-ss");
            //         }
            //     }
            // ]
            // initComplete: function () {
            //     $.fn.dataTable.ext.search.push(
            //         function( settings, data, dataIndex ) {

            //             if ( settings.nTable.id !== 'generated-wastes-table-admin' ) {
            //                 return true;
            //             }

            //             var min = moment($('#daterange-btn-wastes-admin').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
            //             var max = moment($('#daterange-btn-wastes-admin').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
            //             var startDate = moment(data[2]).toDate();

            //             if (min == null && max == null) { return true; }
            //             if (min == null && startDate <= max) { return true;}
            //             if(max == null && startDate >= min) {return true;}
            //             if (startDate <= max && startDate >= min) { return true; }
            //             return false;
            //         }
            //     );
            // }
        });

        // ------------ STORE ----------------

        $('#button-save-guide').on('click', function (e) {
            e.preventDefault();

            var modal = $('#createIntermentGuideModal')
            var form = modal.find('#registerGuideForm');
            var selectInputsLen = $('.selects-inputs-wasteType').length;
            var button = $(this);
            var spinner = button.find('.loadSpinner');

            var passValidation = validateInput();

            if (selectInputsLen == 0) {
                passValidation = false;
            }

            if (passValidation) {
                Swal.fire({
                    title: 'Confirmar solicitud',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true,
                }).then(function (e) {
                    if (e.value === true) {

                        spinner.toggleClass('active')

                        $.ajax({
                            url: form.attr('action'),
                            method: form.attr('method'),
                            data: form.serialize(),
                            dataType: 'JSON',
                            success: function (data) {
                                if (data.success) {
                                    Toast.fire({
                                        icon: 'success',
                                        text: data.message
                                    })

                                    generatedWastesAdminTable.ajax.reload()
                                    modal.modal('hide')
                                } else {
                                    Toast.fire({
                                        icon: 'error',
                                        text: data.message
                                    })
                                }
                            },
                            complete: function () {
                                spinner.toggleClass('active')
                            },
                            error: function (error) {
                                console.log(error)
                            }
                        })

                        // form.submit();
                    } else {
                        e.dismiss;
                    }
                }, function (dismiss) {
                    return false;
                })
            }
            else {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: 'Advertencia:',
                    text: '¡Rellena el formulario para continuar!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        })

        // ------------- EDIT -------------

        var modal = $('#editGuideWasteModal')
        var form = modal.find('#editGuideWasteForm')

        var class_select = form.find('select[name=class_symbol]')
        var waste_type_select = form.find('select[name=waste_type]')
        var gestion_type_select = form.find('select[name=gestion_type]')

        class_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })
        waste_type_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })
        gestion_type_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })

        $('html').on('click', '.editWaste', function () {

            let btn = $(this)
            let getData = btn.data('send')
            let url = btn.data('url')

            form.attr('action', url)
            class_select.empty()
            waste_type_select.empty()
            gestion_type_select.empty()

            $.ajax({
                method: 'GET',
                url: getData,
                dataType: 'JSON',
                success: function (data) {

                    let waste = data.waste
                    let guide = waste.guide
                    let classes = data.classes
                    let waste_class = data.waste_class
                    let gestion_types = data.gestion_types

                    form.find('#code_guide_waste').html(guide.code)

                    $.each(guide, function (key, value) {
                        let input = form.find("[name=" + key + "]");
                        if (input.length) {
                            input.val(value);
                        }
                    })

                    $.each(waste, function (key, value) {
                        let input = form.find("[name=" + key + "]");
                        if (input.length) {
                            input.val(value);
                        }
                    })

                    $.each(classes, function (key, value) {
                        class_select.append('<option value="' + value.id + '">' + value.symbol + '</option>')
                    })
                    class_select.val(waste_class.id).trigger("change");

                    $.each(waste_class.classes_wastes, function (key, value) {
                        waste_type_select.append(`<option value="${value.id}">${value.name}</option>`)
                    })
                    waste_type_select.val(waste.waste.id).trigger("change");

                    $.each(gestion_types, function (key, value) {
                        gestion_type_select.append(`<option value="${key}">${value}</option>`)
                    })
                    gestion_type_select.val(waste.gestion_type).trigger("change");

                    form.find('[name=volum]').val(waste.packing_guide == null ? '' : waste.packing_guide.volum)

                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        class_select.on('change', function () {
            if (modal.hasClass('show')) {

                let url = $(this).data('url')
                let value = class_select.val()

                waste_type_select.empty()

                $.ajax({
                    method: 'GET',
                    url: url,
                    data: {
                        id: value,
                        type: 'wasteClass'
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        let wasteTypes = data.wasteTypes

                        $.each(wasteTypes, function (key, value) {
                            waste_type_select.append(`<option value="${value.id}">${value.name}</option>`)
                        })
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }
        })

        $('#editGuideWasteForm').on('submit', function (e) {
            e.preventDefault()

            var form = $(this);
            var loadSpinner = form.find('.loadSpinner')
            var button = form.find('.btn-save')

            SwalConfirm.fire().then(function (e) {
                if (e.value === true) {

                    button.attr('disabled', 'disabled')
                    loadSpinner.toggleClass('active');

                    $.ajax({
                        type: form.attr('method'),
                        url: form.attr('action'),
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {

                            if (data.success) {

                                Toast.fire({
                                    icon: 'success',
                                    text: data.message
                                })
                                generatedWastesAdminTable.ajax.reload(null, false)

                                modal.modal('hide')
                            }
                            else {
                                ToastError.fire()
                            }
                        },
                        complete: function (data) {
                            button.removeAttr('disabled')
                            loadSpinner.toggleClass('active')
                        },
                        error: function (data) {
                            console.log(data)
                        }
                    })

                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        $('html').on('click', '.deleteWaste', function () {

            let button = $(this)
            let url = button.data('url')

            SwalDelete.fire().then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {

                            if (result.success) {

                                Toast.fire({
                                    icon: 'success',
                                    text: result.message
                                })

                                generatedWastesAdminTable.ajax.reload(null, false);
                            } else {
                                ToastError.fire()
                            }

                        },
                        error: function (error) {
                            console.log(error)
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })

        })


        // ------- TOTALIZADOR ---------------

        generatedWastesAdminTable.on('draw.dt', function () {
            let weightCountInternment = $('#total_weight_count_internment')
            let url = weightCountInternment.data('url')

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    from_date: moment(fromDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'),
                    end_date: moment(toDatepickerinput.datepicker('getDate')).format('YYYY-MM-DD'),
                    warehouse: warehouseFilter.val(),
                    company: companyFilter.val(),
                    code: codeFilter.val(),
                    wastetype: wasteTypeFilter.val(),
                    group: groupFilter.val(),
                },
                success: function (data) {
                    weightCountInternment.val(data.value.toLocaleString('en-US'))
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

    }



    /* ----------- GUIDES APPLICANTT -----------*/


    if ($('#guide-pending-table-applicant').length) {
        var guidePendingApplicantTableEle = $('#guide-pending-table-applicant');
        var getDataUrl = guidePendingApplicantTableEle.data('url');
        var guidePendingApplicantTable = guidePendingApplicantTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "pending"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'stat_approved', name: 'stat_approved', orderable: false },
                { data: 'stat_recieved', name: 'stat_recieved', orderable: false },
                { data: 'stat_verified', name: 'stat_verified', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false, className: 'text-center not-export-col' },
            ]
        });
    }

    if ($('#guide-approved-table-applicant').length) {
        var guideApprovedApplicantTableEle = $('#guide-approved-table-applicant');
        var getDataUrl = guideApprovedApplicantTableEle.data('url');
        var guideApprovedApplicantTable = guideApprovedApplicantTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "approved"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'stat_approved', name: 'stat_approved', orderable: false },
                { data: 'stat_recieved', name: 'stat_recieved', orderable: false },
                { data: 'stat_verified', name: 'stat_verified', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false, className: 'text-center' },
            ]
        });
    }

    if ($('#guide-rejected-table-applicant').length) {
        var guideRejectedApplicantTableEle = $('#guide-rejected-table-applicant');
        var getDataUrl = guideRejectedApplicantTableEle.data('url');
        var guideRejectedApplicantTable = guideRejectedApplicantTableEle.DataTable({
            order: [[1, 'desc']],
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "rejected"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'stat_approved', name: 'stat_approved', orderable: false },
                { data: 'stat_recieved', name: 'stat_recieved', orderable: false },
                { data: 'stat_verified', name: 'stat_verified', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }



    if ($('#registerGuideForm').length) {


        $('html').on('click', '#btn-register-intguide-modal', function () {
            let btn = $(this)
            let url = btn.data('url');
            let modal = $('#createIntermentGuideModal');
            // let selectTypes = $('#registerWasteTypesSelect');

            let spinner = btn.find('.loadSpinner');
            spinner.toggleClass('active');

            let container = modal.find('#content-register-intguide')

            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'JSON',
                success: function (data) {
                    let html = data.html
                    container.html(html)

                    let guideWarehouseSelect = $('#guide-warehouse-select');
                    guideWarehouseSelect.select2({
                        dropdownParent: '#registerGuideForm',
                        placeholder: 'Selecciona un punto verde'
                    });

                    var guideWasteClassSelect = $('#guide-wasteClass-select');
                    guideWasteClassSelect.select2({
                        dropdownParent: '#registerGuideForm',
                        placeholder: 'Selecciona una clase de residuo',
                    });

                    var guideWasteTypesSelect = $('#guide-wasteTypes-select');
                    guideWasteTypesSelect.select2({
                        dropdownParent: '#registerGuideForm',
                        placeholder: 'Selecciona uno o más tipos de residuo',
                        closeOnSelect: false
                    })

                    modal.modal('show')
                },
                complete: function () {
                    spinner.toggleClass('active');
                },
                error: function (data) {
                    console.log(data)
                }
            })

        })


        $('html').on('change', '#guide-warehouse-select', function () {
            var id = $(this).val();
            var url = $(this).data('url');

            $.ajax({
                type: 'GET',
                data: {
                    'id': id,
                    'type': 'warehouse'
                },
                url: url,
                dataType: 'JSON',
                success: function (data) {

                    $('#guide-lot-dis').val(data.lot)
                    // $('#guide-stage-dis').val(data.stage);
                    $('#guide-location-dis').val(data.location)
                    $('#guide-activity-dis').val(data.activity)
                    $('#guide-proyect-dis').val(data.proyect)
                    $('#guide-company-dis').val(data.company)
                    // $('#guide-front-dis').val(data.front);

                },
                error: function (data) {
                    console.log(data)
                }
            });
        })

        $('html').on('change', '#guide-wasteClass-select', function () {
            var url = $(this).data('url');
            var id = $(this).val();
            var selectWasteTypes = $('#guide-wasteTypes-select');

            $.ajax({
                url: url,
                data: {
                    "id": id,
                    'type': 'wasteClass'
                },
                type: "GET",
                dataType: "JSON",
                success: function (data) {
                    selectWasteTypes.html('');
                    selectWasteTypes.append('<option value=""></option>');
                    $.each(data['wasteTypes'], function (key, value) {
                        selectWasteTypes.append('<option value="' + value.id + '">' + value.name + '</option>')
                    })
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        $('html').on('click', '#btn-save-classWaste-guide', function (e) {
            e.preventDefault();
            var selectTypes = $('#guide-wasteTypes-select');
            var values = selectTypes.val();
            var url = $(this).data('url');
            var tablePrepend = $('#table-classTypes-body');

            if (values.length == 0) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: 'Advertencia:',
                    text: '¡Selecciona al menos un tipo de residuo para continuar!',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
            else {
                $.ajax({
                    type: 'GET',
                    url: url,
                    data: {
                        "values": values,
                        "type": 'wasteType'
                    },
                    dataType: 'JSON',
                    success: function (data) {

                        $.each(data['wasteTypes'], function (key, value) {

                            if (!$('#rowClassType-' + value.id).length) {
                                tablePrepend.prepend('<tr id="rowClassType-' + value.id + '"> \
                                                        <input type="hidden" name="wasteTypesId[]" value="'+ value.id + '"> \
                                                        <td>'+ value['classes_wastes'][0].symbol + '</td> \
                                                        <td>'+ value['name'] + '</td> \
                                                        <td> \
                                                            <input name="aproxWeightType-'+ value.id + '" class="form-control col-6 selects-inputs-wasteType select-weight required-input" type="number" min="0" step="0.01" value=""> \
                                                        </td> \
                                                        <td> <select name="gestionType-'+ value.id + '" class="form-control select2 select-packages required-input">\
                                                            </select>\
                                                        </td> \
                                                        <td> \
                                                            <button class="delete-row-wasteype-guide btn btn-danger">\
                                                                <i class="fa-solid fa-trash-can"></i>\
                                                            </button>\
                                                        </td> \
                                                    </tr>');

                                var selectPackages = $('#rowClassType-' + value.id).find('.select-packages');
                                selectPackages.append('<option value=""></option>');

                                $.each(data['gestionTypes'], function (key2, value2) {
                                    selectPackages.append('<option value="' + key2 + '">' + value2 + '</option>');
                                })

                                selectPackages.select2({
                                    placeholder: 'Selecciona una gestión',
                                })
                            }
                        })
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }
        })

        $('html').on('click', '.delete-row-wasteype-guide', function (e) {
            e.preventDefault();
            $(this).closest('tr').remove();
            var totalWeight = 0;
            // var totalQuantity = 0

            $('.select-weight').each(function () {
                totalWeight += Number($(this).val());
            })

            // $('.select-quantity').each(function () {
            //     totalQuantity += Number($(this).val());
            // })

            // $('#info-package-quantity').html(totalQuantity);
            $('#info-total-weight').html(totalWeight.toFixed(2));
        })

        $('html').on('input', '.select-weight', function () {
            var totalWeight = 0

            $('.select-weight').each(function () {
                totalWeight += Number($(this).val());
            })

            $('#info-total-weight').html(totalWeight.toFixed(2));
        })

        // $('html').on('input', '.select-quantity', function () {
        //     var totalQuantity = 0

        //     $('.select-quantity').each(function () {
        //         totalQuantity += Number($(this).val());
        //     })

        //     // $('#info-package-quantity').html(totalQuantity);
        // })

        // $('#guide-approvings-select').on('change', function () {
        //     $('#info-type-user-guide').html('APROBANTE');
        // })




        // var guideApprovingsSelect = $('#guide-approvings-select');
        // guideApprovingsSelect.select2({
        //     multiple: true,
        //     placeholder: 'Selecciona uno o más aprobantes',
        //     closeOnSelect: false
        // });

    }




    if ($('#daterange-btn-wastes-applicant').length) {

        $('.date-range-input').val('Todos los registros');

        $('.daterange-cus').daterangepicker({
            locale: { format: 'YYYY-MM-DD' },
            drops: 'down',
            opens: 'right'
        });

        $('#daterange-btn-wastes-applicant').daterangepicker({
            ranges: {
                'Todo': [moment('1970-01-01'), moment().add(1, 'days')],
                'Hoy': [moment(), moment().add(1, 'days')],
                'Ayer': [moment().subtract(1, 'days'), moment()],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
                'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')]
            },
            startDate: moment('1970-01-01'),
            endDate: moment().add(1, 'days'),
        }, function (start, end) {
            if (start.format('YYYY-MM-DD') == '1970-01-01') {
                $('.date-range-input').val('Todos los registros');
            } else {
                $('.date-range-input').val('Del: ' + start.format('YYYY-MM-DD') + ' hasta el: ' + end.format('YYYY-MM-DD'))
            }
            generatedWastesApplicantTable.draw();
        });
    }


    if ($('#generated-wastes-table-applicant').length) {

        var generatedWastesApplicantTableEle = $('#generated-wastes-table-applicant');
        var getDataUrl = generatedWastesApplicantTableEle.data('url');
        var generatedWastesApplicantTable = generatedWastesApplicantTableEle.DataTable({
            order: [[3, 'desc']],
            responsive: true,
            language: DataTableEs,
            ajax: {
                "url": getDataUrl,
                // "data": function(data){
                //     data.from_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').startDate.format('YYYY-MM-DD');
                //     data.end_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').endDate.format('YYYY-MM-DD');
                // }
            },
            columns: [
                { data: 'id', name: 'id' },
                // {data: 'packing_guide.cod_guide', name:'packingGuide.cod_guide'}, //
                { data: 'guide.code', name: 'guide.code' },// NRO GUÍA
                { data: 'guide.date_approved', name: 'guide.date_approved' }, // FECHA DE VERIFICACIÓN
                { data: 'guide.date_verified', name: 'guide.date_verified' }, // FECHA DE VERIFICACIÓN

                { data: 'guide.warehouse.lot.name', name: 'guide.warehouse.lot.name' }, // LOTE
                { data: 'guide.warehouse.stage.name', name: 'guide.warehouse.stage.name' }, // ETAPA
                { data: 'guide.warehouse.location.name', name: 'guide.warehouse.location.name' }, // SITE LOCACIÓN
                { data: 'guide.warehouse.project_area.name', name: 'guide.warehouse.projectArea.name' }, // PROYECTO
                { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' }, // EMPRESA
                { data: 'guide.warehouse.front.name', name: 'guide.warehouse.front.name' }, // FRENTE

                { data: 'waste.classes_wastes', name: 'waste.classesWastes.symbol', orderable: false }, // CLASE
                { data: 'waste.name', name: 'waste.name', orderable: false },///  NOMBRE DE RESIDUO
                { data: 'package.name', name: 'package.name', orderable: false },//  TIPO DE EMPAQUE
                { data: 'actual_weight', name: 'actual_weight', orderable: false },//  PESO REAL
                { data: 'package_quantity', name: 'package_quantity', orderable: false },//// NRO DE BULTOS

                { data: 'packing_guide.volum', name: 'packingGuide.volum', orderable: false, searchable: false },// VOLUMEN
                { data: 'packing_guide.date_guides_departure', name: 'packingGuide.date_guides_departure' }, // FECHA SALIDA DEL RESIDUO
                { data: 'date_departure', name: 'date_departure', orderable: false, searchable: false },  // FECHA SALIDA MALVINAS

                // Disposición

                { data: 'disposition.code_green_care', name: 'disposition.code_green_care' }, // * 17
                { data: 'disposition.destination', name: 'disposition.destination' },
                { data: 'disposition.plate_init', name: 'disposition.plate_init' },
                { data: 'disposition.weigth_init', name: 'disposition.weigth_init' },
                { data: 'disposition.date_departure', name: 'disposition.date_departure' },
                { data: 'disposition.code_dff', name: 'disposition.code_dff' },
                { data: 'disposition.weigth', name: 'disposition.weigth' },
                { data: 'disposition.weigth_diff', name: 'disposition.weigth_diff' },
                { data: 'disposition.disposition_place', name: 'disposition.disposition_place' },
                { data: 'disposition.code_invoice', name: 'disposition.code_invoice' },
                { data: 'disposition.code_certification', name: 'disposition.code_certification' },
                { data: 'disposition.plate', name: 'disposition.plate' },
                { data: 'disposition.managment_report', name: 'disposition.managment_report' },
                { data: 'disposition.observations', name: 'disposition.observations' },
                { data: 'disposition.date_dff', name: 'disposition.date_dff' },
                { data: 'disposition.status', name: 'disposition.status' } // * 32
            ],
            columnDefs: [
                { 'visible': false, 'targets': [4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    title: function () {
                        var from_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'El principio' };
                        return 'RESIDUOS GENERADOS - SOLICITANTE: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
                    },
                    filename: function () {
                        var from_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-applicant').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'todos' };
                        return 'residuos-generados_solicitante-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
                    }
                }
            ],
            initComplete: function () {
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {

                        if (settings.nTable.id !== 'generated-wastes-table-applicant') {
                            return true;
                        }

                        var min = moment($('#daterange-btn-wastes-applicant').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
                        var max = moment($('#daterange-btn-wastes-applicant').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
                        var startDate = moment(data[3]).toDate();

                        console.log(startDate)
                        if (min == null && max == null) { return true; }
                        if (min == null && startDate <= max) { return true; }
                        if (max == null && startDate >= min) { return true; }
                        if (startDate <= max && startDate >= min) { return true; }
                        return false;
                    }
                );
            }
        })
    }













    /* -------------- APPROVING --------------------*/


    if ($('#guide-pending-table-approvant').length) {

        var guidePendingTableEle = $('#guide-pending-table-approvant');
        var getDataUrl = guidePendingTableEle.data('url');
        var guidePendingTable = guidePendingTableEle.DataTable({
            language: DataTableEs,
            responsive: true,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "pending"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });

    }


    if ($('#register-approved-guide-form').length) {

        $('#button-save-approved-guide').on('click', function (e) {
            e.preventDefault();
            var form = $('#register-approved-guide-form');

            Swal.fire({
                title: 'Confirmar Aprobación',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })
        })

        $('#button-rejected-guide').on('click', function (e) {
            e.preventDefault();
            var form = $('#form-reject-guide');
            Swal.fire({
                title: 'Rechazar solicitud',
                text: 'Luego se podrá deshacer esta acción',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Rechazar',
                cancelButtonText: 'Atrás',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })

        })
    }


    if ($('#guide-approved-table-approvant').length) {
        var guideApprovedTableEle = $('#guide-approved-table-approvant');
        var getDataUrl = guideApprovedTableEle.data('url');
        var guideApprovedTable = guideApprovedTableEle.DataTable({
            language: DataTableEs,
            responsive: true,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "approved"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#guide-rejected-table-approvant').length) {
        var guideRejectedTableEle = $('#guide-rejected-table-approvant');
        var getDataUrl = guideRejectedTableEle.data('url');
        var guideApprovedTable = guideRejectedTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "rejected"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name', orderable: false },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name', orderable: false },
                { data: 'warehouse.location.name', name: 'warehouse.location.name', orderable: false },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name', orderable: false },
                { data: 'warehouse.company.name', name: 'warehouse.company.name', orderable: false },
                { data: 'warehouse.front.name', name: 'warehouse.front.name', orderable: false },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#daterange-btn-wastes-approver').length) {

        $('.date-range-input').val('Todos los registros');

        $('.daterange-cus').daterangepicker({
            locale: { format: 'YYYY-MM-DD' },
            drops: 'down',
            opens: 'right'
        });

        $('#daterange-btn-wastes-approver').daterangepicker({
            ranges: {
                'Todo': [moment('1970-01-01'), moment().add(1, 'days')],
                'Hoy': [moment(), moment().add(1, 'days')],
                'Ayer': [moment().subtract(1, 'days'), moment()],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
                'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')]
            },
            startDate: moment('1970-01-01'),
            endDate: moment().add(1, 'days'),
        }, function (start, end) {
            if (start.format('YYYY-MM-DD') == '1970-01-01') {
                $('.date-range-input').val('Todos los registros');
            } else {
                $('.date-range-input').val('Del: ' + start.format('YYYY-MM-DD') + ' hasta el: ' + end.format('YYYY-MM-DD'))
            }
            generatedWastesApproverTable.draw();
        });
    }

    if ($('#generated-wastes-table-approver').length) {

        var generatedWastesApproverTableEle = $('#generated-wastes-table-approver');
        var getDataUrl = generatedWastesApproverTableEle.data('url');
        var generatedWastesApproverTable = generatedWastesApproverTableEle.DataTable({
            order: [[3, 'desc']],
            responsive: true,
            language: DataTableEs,
            ajax: {
                "url": getDataUrl,
                // "data": function(data){
                //     data.from_date = $('#daterange-btn-wastes-approver').data('daterangepicker').startDate.format('YYYY-MM-DD');
                //     data.end_date = $('#daterange-btn-wastes-approver').data('daterangepicker').endDate.format('YYYY-MM-DD');
                // }
            },
            columnDefs: [
                { 'visible': false, 'targets': [4, 5, 6, 7, 8, 9, 16, 17] }
            ],
            columns: [
                { data: 'id', name: 'id' },
                // {data: 'packing_guide.cod_guide', name:'packingGuide.cod_guide'}, //
                { data: 'guide.code', name: 'guide.code' },// NRO GUÍA
                { data: 'guide.date_approved', name: 'guide.date_approved' }, // FECHA DE VERIFICACIÓN
                { data: 'guide.date_verified', name: 'guide.date_verified' }, // FECHA DE VERIFICACIÓN

                { data: 'guide.warehouse.lot.name', name: 'guide.warehouse.lot.name' }, // LOTE
                { data: 'guide.warehouse.stage.name', name: 'guide.warehouse.stage.name' }, // ETAPA
                { data: 'guide.warehouse.location.name', name: 'guide.warehouse.location.name' }, // SITE LOCACIÓN
                { data: 'guide.warehouse.project_area.name', name: 'guide.warehouse.projectArea.name' }, // PROYECTO
                { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' }, // EMPRESA
                { data: 'guide.warehouse.front.name', name: 'guide.warehouse.front.name' }, // FRENTE

                { data: 'waste.classes_wastes', name: 'waste.classesWastes.symbol', orderable: false }, // CLASE
                { data: 'waste.name', name: 'waste.name', orderable: false },///  NOMBRE DE RESIDUO
                { data: 'package.name', name: 'package.name', orderable: false },//  TIPO DE EMPAQUE
                { data: 'actual_weight', name: 'actual_weight', orderable: false },//  PESO REAL
                { data: 'package_quantity', name: 'package_quantity', orderable: false },//// NRO DE BULTOS

                { data: 'packing_guide.volum', name: 'packingGuide.volum', orderable: false, searchable: false },// VOLUMEN
                { data: 'packing_guide.date_guides_departure', name: 'packingGuide.date_guides_departure' }, // FECHA SALIDA DEL RESIDUO
                { data: 'date_departure', name: 'date_departure', orderable: false, searchable: false },  // FECHA SALIDA MALVINAS
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    title: function () {
                        var from_date = $('#daterange-btn-wastes-approver').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-approver').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'El principio' };
                        return 'RESIDUOS GENERADOS - APROBANTE: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
                    },
                    filename: function () {
                        var from_date = $('#daterange-btn-wastes-approver').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-approver').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'todos' };
                        return 'residuos-generados_aprobante-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
                    }
                }
            ],
            initComplete: function () {
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {

                        if (settings.nTable.id !== 'generated-wastes-table-approver') {
                            return true;
                        }

                        var min = moment($('#daterange-btn-wastes-approver').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
                        var max = moment($('#daterange-btn-wastes-approver').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
                        var startDate = moment(data[3]).toDate();

                        console.log(startDate)
                        if (min == null && max == null) { return true; }
                        if (min == null && startDate <= max) { return true; }
                        if (max == null && startDate >= min) { return true; }
                        if (startDate <= max && startDate >= min) { return true; }
                        return false;
                    }
                );
            }
        })
    }






    /* -------------- RECIEVER ---------------*/


    if ($('#guide-pending-table-reciever').length) {

        var guideRecieverPendingTableEle = $('#guide-pending-table-reciever');
        var getDataUrl = guideRecieverPendingTableEle.data('url');
        var guideRecieverPendingTable = guideRecieverPendingTableEle.DataTable({
            language: DataTableEs,
            responsive: true,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "pending"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#register-recieved-guide-form').length) {

        $('body').on('input', '.select-actual-weight', function () {
            var totalWeight = 0

            $('.select-actual-weight').each(function () {
                totalWeight += Number($(this).val());
            })

            $('#info-actual-total-weight').html(totalWeight.toFixed(2));
        })


        $('#button-save-reciever-guide').on('click', function (e) {
            e.preventDefault();

            var form = $('#register-recieved-guide-form');

            var passValidation = validateInput();

            if (passValidation) {
                Swal.fire({
                    title: 'Confirmar Recepción',
                    text: '¡Esta acción no se podrá deshacer!',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Aprobar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit();
                    }
                }, function (dismiss) {
                    return false;
                })

            } else {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    title: 'Advertencia:',
                    text: 'LLena todos los campos para continuar',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        })


        $('#button-rejected-reciever-guide').on('click', function (e) {
            e.preventDefault();
            var form = $('#form-reject-reciever-guide');
            Swal.fire({
                title: '¿Rechazar guía de internamiento?',
                text: 'Luego se podrá deshacer esta acción',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Rechazar',
                cancelButtonText: 'cerrar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })
        })
    }

    if ($('#guide-recieved-table-reciever').length) {
        var guideRecieverTableEle = $('#guide-recieved-table-reciever');
        var getDataUrl = guideRecieverTableEle.data('url');
        var guideRecievedTable = guideRecieverTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "recieved"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#guide-rejected-table-reciever').length) {
        var guideRejectedRecieverTableEle = $('#guide-rejected-table-reciever');
        var getDataUrl = guideRejectedRecieverTableEle.data('url');
        var guideApprovedTable = guideRejectedRecieverTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "rejected"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#daterange-btn-wastes-reciever').length) {

        $('.date-range-input').val('Todos los registros');

        $('.daterange-cus').daterangepicker({
            locale: { format: 'YYYY-MM-DD' },
            drops: 'down',
            opens: 'right'
        });

        $('#daterange-btn-wastes-reciever').daterangepicker({
            ranges: {
                'Todo': [moment('1970-01-01'), moment().add(1, 'days')],
                'Hoy': [moment(), moment().add(1, 'days')],
                'Ayer': [moment().subtract(1, 'days'), moment()],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
                'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')]
            },
            startDate: moment('1970-01-01'),
            endDate: moment().add(1, 'days'),
        }, function (start, end) {
            if (start.format('YYYY-MM-DD') == '1970-01-01') {
                $('.date-range-input').val('Todos los registros');
            } else {
                $('.date-range-input').val('Del: ' + start.format('YYYY-MM-DD') + ' hasta el: ' + end.format('YYYY-MM-DD'))
            }
            generatedWastesRecieverTable.draw();
        });
    }

    if ($('#generated-wastes-table-reciever').length) {

        var generatedWastesRecieverTableEle = $('#generated-wastes-table-reciever');
        var getDataUrl = generatedWastesRecieverTableEle.data('url');
        var generatedWastesRecieverTable = generatedWastesRecieverTableEle.DataTable({
            responsive: true,
            order: [[3, 'desc']],
            language: DataTableEs,
            ajax: {
                "url": getDataUrl
            },
            columns: [
                { data: 'id', name: 'id' },
                // {data: 'packing_guide.cod_guide', name:'packingGuide.cod_guide'}, //
                { data: 'guide.code', name: 'guide.code' },// NRO GUÍA
                { data: 'guide.date_approved', name: 'guide.date_approved' }, // FECHA DE VERIFICACIÓN
                { data: 'guide.date_verified', name: 'guide.date_verified' }, // FECHA DE VERIFICACIÓN

                { data: 'guide.warehouse.lot.name', name: 'guide.warehouse.lot.name' }, // LOTE
                { data: 'guide.warehouse.stage.name', name: 'guide.warehouse.stage.name' }, // ETAPA
                { data: 'guide.warehouse.location.name', name: 'guide.warehouse.location.name' }, // SITE LOCACIÓN
                { data: 'guide.warehouse.project_area.name', name: 'guide.warehouse.projectArea.name' }, // PROYECTO
                { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' }, // EMPRESA
                { data: 'guide.warehouse.front.name', name: 'guide.warehouse.front.name' }, // FRENTE

                { data: 'waste.classes_wastes', name: 'waste.classesWastes.symbol', orderable: false }, // CLASE
                { data: 'waste.name', name: 'waste.name', orderable: false },///  NOMBRE DE RESIDUO
                { data: 'package.name', name: 'package.name', orderable: false },//  TIPO DE EMPAQUE
                { data: 'actual_weight', name: 'actual_weight', orderable: false },//  PESO REAL
                { data: 'package_quantity', name: 'package_quantity', orderable: false },//// NRO DE BULTOS

                { data: 'packing_guide.volum', name: 'packingGuide.volum', orderable: false, searchable: false },// VOLUMEN
                { data: 'packing_guide.date_guides_departure', name: 'packingGuide.date_guides_departure' }, // FECHA SALIDA DEL RESIDUO
                { data: 'date_departure', name: 'date_departure', orderable: false, searchable: false },  // FECHA SALIDA MALVINAS
            ],
            columnDefs: [
                { 'visible': false, 'targets': [4, 5, 6, 7, 8, 9, 16, 17] }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    title: function () {
                        var from_date = $('#daterange-btn-wastes-reciever').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-reciever').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'El principio' };
                        return 'RESIDUOS GENERADOS - RECEPTOR: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
                    },
                    filename: function () {
                        var from_date = $('#daterange-btn-wastes-reciever').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-wastes-reciever').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-wastes-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'todos' };
                        return 'residuos-generados_receptor-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
                    }
                }
            ],
            initComplete: function () {
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {

                        if (settings.nTable.id !== 'generated-wastes-table-reciever') {
                            return true;
                        }

                        var min = moment($('#daterange-btn-wastes-reciever').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
                        var max = moment($('#daterange-btn-wastes-reciever').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
                        var startDate = moment(data[3]).toDate();

                        if (min == null && max == null) { return true; }
                        if (min == null && startDate <= max) { return true; }
                        if (max == null && startDate >= min) { return true; }
                        if (startDate <= max && startDate >= min) { return true; }
                        return false;
                    }
                );
            }
        })
    }





    /* -------------  VERIFICATOR  -------------*/

    if ($('#daterange-btn-wastes-verificator').length) {

        $('.date-range-input').val('Todos los registros');

        $('.daterange-cus').daterangepicker({
            locale: { format: 'YYYY-MM-DD' },
            drops: 'down',
            opens: 'right'
        });

        $('#daterange-btn-wastes-verificator').daterangepicker({
            ranges: {
                'Todo': [moment('1970-01-01'), moment().add(1, 'days')],
                'Hoy': [moment(), moment().add(1, 'days')],
                'Ayer': [moment().subtract(1, 'days'), moment()],
                'Últimos 7 días': [moment().subtract(6, 'days'), moment().add(1, 'days')],
                'Últimos 30 días': [moment().subtract(29, 'days'), moment().add(1, 'days')],
                'Este mes': [moment().startOf('month'), moment().endOf('month').add(1, 'days')],
                'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month').add(1, 'days')]
            },
            startDate: moment('1970-01-01'),
            endDate: moment().add(1, 'days'),
        }, function (start, end) {
            if (start.format('YYYY-MM-DD') == '1970-01-01') {
                $('.date-range-input').val('Todos los registros');
            } else {
                $('.date-range-input').val('Del: ' + start.format('YYYY-MM-DD') + ' hasta el: ' + end.format('YYYY-MM-DD'))
            }
            generatedWastesCheckerTable.draw();
        });
    }


    if ($('#guide-pending-table-verificator').length) {
        var guideVerificatorPendingTableEle = $('#guide-pending-table-verificator');
        var getDataUrl = guideVerificatorPendingTableEle.data('url');
        var guideVerificatorPendingTable = guideVerificatorPendingTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "pending"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false, className: 'text-center' },
            ]
        });
    }


    if ($('#register-verified-guide-form').length) {


        $('#button-save-verified-guide').on('click', function (e) {
            e.preventDefault();

            var form = $('#register-verified-guide-form');

            Swal.fire({
                title: '¿Verificar Guía de Internamiento?',
                text: 'Esta acción no se podrá deshacer',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Verificar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })
        })


        $('#button-rejected-verified-guide').on('click', function (e) {
            e.preventDefault();
            var form = $('#form-reject-verified-guide');
            Swal.fire({
                title: '¿Rechazar guía de internamiento?',
                text: 'Luego se podrá deshacer esta acción.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Rechazar',
                cancelButtonText: 'cerrar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })

        })


    }


    if ($('#guide-verified-table-verificator').length) {
        var guideVerifiedTableEle = $('#guide-verified-table-verificator');
        var getDataUrl = guideVerifiedTableEle.data('url');
        var guideVerifiedTable = guideVerifiedTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "verified"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
                { data: 'pdf', name: 'pdf', orderable: false, searchable: false, className: 'text-center' },
            ]
        });
    }

    if ($('#guide-rejected-table-verificator').length) {
        var guideRejectedVerificatorTableEle = $('#guide-rejected-table-verificator');
        var getDataUrl = guideRejectedVerificatorTableEle.data('url');
        var guideApprovedTable = guideRejectedVerificatorTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": {
                    "table": "rejected"
                }
            },
            columns: [
                { data: 'code', name: 'code' },
                { data: 'created_at', name: 'created_at' },
                { data: 'warehouse.lot.name', name: 'warehouse.lot.name' },
                { data: 'warehouse.stage.name', name: 'warehouse.stage.name' },
                { data: 'warehouse.location.name', name: 'warehouse.location.name' },
                { data: 'warehouse.project_area.name', name: 'warehouse.projectArea.name' },
                { data: 'warehouse.company.name', name: 'warehouse.company.name' },
                { data: 'warehouse.front.name', name: 'warehouse.front.name' },
                { data: 'action', name: 'action', orderable: false, searchable: false },
            ]
        });
    }


    if ($('#generated-wastes-table-verificator').length) {

        var generatedWastesCheckerTable;

        var formGeneratedWastesVerificatorContainer = $('#form-generated-wastes-verificator-container')

        var inputFromDate = formGeneratedWastesVerificatorContainer.find("input[name=from_date]");
        var inputEndDate = formGeneratedWastesVerificatorContainer.find("input[name=end_date]");

        var inputDateRange = $('#date-range-input-wastes-verificator')
        var dateBtn = $('#daterange-btn-wastes-verificator')

        if (inputDateRange.length) {

            inputDateRange.val('Todos los registros')
            dateBtn.daterangepicker(dateRangeConfig, function (start, end) {
                var equalDates = start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')

                if (equalDates) {
                    inputFromDate.each(function () {
                        $(this).val("")
                    })
                    inputEndDate.each(function () {
                        $(this).val("")
                    })
                    inputDateRange.val('Todos los registros')
                } else {
                    inputFromDate.each(function () {
                        $(this).val(start.format("YYYY-MM-DD"))
                    })
                    inputEndDate.each(function () {
                        $(this).val(end.format("YYYY-MM-DD"))
                    })

                    inputDateRange.val('Del: ' + start.format('YYYY-MM-DD') + ' hasta el: ' + end.format('YYYY-MM-DD'))
                }

                generatedWastesCheckerTable.ajax.reload()
            });
        }

        var generatedWastesCheckerTableEle = $('#generated-wastes-table-verificator');
        var getDataUrl = generatedWastesCheckerTableEle.data('url');
        generatedWastesCheckerTable = generatedWastesCheckerTableEle.DataTable({
            responsive: true,
            order: [[3, 'desc']],
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": function (data) {
                    var startDate = $('#daterange-btn-wastes-verificator').data('daterangepicker').startDate.format('YYYY-MM-DD')
                    var endDate = $('#daterange-btn-wastes-verificator').data('daterangepicker').endDate.format('YYYY-MM-DD')
                    var equalValues = startDate == endDate
                    data.from_date = equalValues ? null : startDate;
                    data.end_date = equalValues ? null : endDate;
                }
            },
            columns: [
                { data: 'id', name: 'id' },
                // {data: 'packing_guide.cod_guide', name:'packingGuide.cod_guide'}, //
                { data: 'guide.code', name: 'guide.code' },// NRO GUÍA
                { data: 'guide.date_approved', name: 'guide.date_approved' }, // FECHA DE VERIFICACIÓN
                { data: 'guide.date_verified', name: 'guide.date_verified' }, // FECHA DE VERIFICACIÓN

                { data: 'waste.classes_wastes', name: 'waste.classesWastes.symbol', orderable: false }, // CLASE
                { data: 'waste.name', name: 'waste.name' },///  NOMBRE DE RESIDUO
                { data: 'package.name', name: 'package.name' },//  TIPO DE EMPAQUE
                { data: 'actual_weight', name: 'actual_weight' },//  PESO REAL
                { data: 'package_quantity', name: 'package_quantity' },//// NRO DE BULTOS

                { data: 'packing_guide.volum', name: 'packingGuide.volum' },// VOLUMEN
            ],
            // dom: 'Bfrtip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         title: function () {
            //             var from_date = $('#daterange-btn-wastes-verificator').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastes-verificator').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastes-info').data('name');
            //             if (from_date == '1970-01-01') { from_date = 'El principio' };
            //             return 'RESIDUOS GENERADOS - SUPERVISOR: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
            //         },
            //         filename: function () {
            //             var from_date = $('#daterange-btn-wastes-verificator').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastes-verificator').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastes-info').data('name');
            //             if (from_date == '1970-01-01') { from_date = 'todos' };
            //             return 'residuos-generados_supervisor-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
            //         }
            //     }
            // ],
            // initComplete: function () {
            //     $.fn.dataTable.ext.search.push(
            //         function (settings, data, dataIndex) {

            //             if (settings.nTable.id !== 'generated-wastes-table-verificator') {
            //                 return true;
            //             }

            //             var min = moment($('#daterange-btn-wastes-verificator').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
            //             var max = moment($('#daterange-btn-wastes-verificator').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
            //             var startDate = moment(data[3]).toDate();

            //             console.log(startDate)
            //             if (min == null && max == null) { return true; }
            //             if (min == null && startDate <= max) { return true; }
            //             if (max == null && startDate >= min) { return true; }
            //             if (startDate <= max && startDate >= min) { return true; }
            //             return false;
            //         }
            //     );
            // }
        })
    }








    /* ------------- UNDO REJECT GUIDE -------------*/

    if ($('#undoRejected-guide-form').length) {

        $('#button-undoReject-guide').on('click', function (e) {
            e.preventDefault();
            var form = $('#undoRejected-guide-form');

            Swal.fire({
                title: 'Confirmar',
                text: '¿Deshacer la acción?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            }, function (dismiss) {
                return false;
            })

        });

    }




    /* -----------  MANAGER STOCK ------------*/


    /* --------- PACKING WASTES ------------*/


    // if ($('#daterange-btn-waste-departure-manager').length) {

    //     let input_max_date_depart = $('input#max_date_depart').val()
    //     let input_min_date_depart = $('input#min_date_depart').val()

    //     let end = moment(input_max_date_depart, "YYYY-MM-DD HH:mm:ss").add(1, 'days');
    //     let start = moment(input_min_date_depart, "YYYY-MM-DD HH:mm:ss")

    //     $('#date-range-input-waste-departure').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

    //     $('#daterange-btn-waste-departure-manager').daterangepicker({
    //         startDate: start,
    //         endDate: end,
    //         showDropdowns: true,
    //     },
    //         function (start, end) {
    //             $('#date-range-input-waste-departure').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

    //             inputFromDateDepartures.val(start.format('YYYY-MM-DD'))
    //             inputEndDateDepartures.val(end.format('YYYY-MM-DD'))

    //             packingGuideManagerTable.ajax.reload();
    //         });
    // }

    $('html').on('click', '.btn-show-internmentGuide', function (e) {
        e.preventDefault()
        var button = $(this);
        var url = button.data('url');
        var modal = $('#showInternmentGuideDetailModal');
        var modalBody = modal.find('.modal-body');

        modalBody.empty()

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'JSON',
            success: function (data) {
                modalBody.html(data.html)
                modal.modal('show');
            },
            error: function (data) {
                console.log(data)
            }
        })

    })


    if ($('#interment-wastes-table-manager').length) {

        var intermentWasteManagerTable

        var formIntenmentWastes = $('#form-internment-wastes-report')

        var inputFromDateWastes = formIntenmentWastes.find('input[name=from_date]')
        var inputEndDateWastes = formIntenmentWastes.find('input[name=end_date]')
        var inputStatusWastes = formIntenmentWastes.find('input[name=status]')

        // * --------- FILTRO FECHA -----------

        let containerDaterangeStock = $('#stock-datepicker.datepicker-range-container.input-daterange')

        let input_max_date = $('input#max_date_stock').val()
        let input_min_date = $('input#min_date_stock').val()

        containerDaterangeStock.datepicker({
            language: 'es',
            orientation: "bottom auto"
        })

        var fromDatepickerinputStock = $('#fromDateSelectStock')
        var toDatepickerinputStock = $('#toDateSelectStock')

        containerDaterangeStock.find('input[name=fromDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date(input_min_date))
                .on('hide', function (e) {

                    let prevValue = inputFromDateWastes.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        intermentWasteManagerTable.ajax.reload()
                    }

                    inputFromDateWastes.val(date)
                    inputEndDateWastes.val(moment(toDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })
        containerDaterangeStock.find('input[name=toDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date(input_max_date))
                .on('hide', function (e) {

                    let prevValue = inputEndDateWastes.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        intermentWasteManagerTable.ajax.reload()
                    }

                    inputEndDateWastes.val(date)
                    inputFromDateWastes.val(moment(fromDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })

        // * ----------------------------------

        // var wasteCompanySelect = $('#waste_company_select');
        // wasteCompanySelect.select2({
        //     placeholder: 'Selecciona una empresa',
        //     allowClear: true
        // });

        // var wastePackageSelect = $('#waste_package_type_select');
        // wastePackageSelect.select2({
        //     placeholder: 'Selecciona un tipo de embalaje',
        //     allowClear: true
        // });

        // * ----- FILTERS ---------

        let warehouseFilter = $('#waste_warehouse_select')
        let companyFilter = $('#waste_company_select')
        let codeFilter = $('#waste_code_select')
        let groupFilter = $('#waste_group_select')

        $('html').on('change', '.waste_internment_select', function () {
            intermentWasteManagerTable.ajax.reload()
            let select = $(this)
            let thisName = select.attr('name')
            let value = select.val()

            let inputFilter = formIntenmentWastes.find(`input[name=${thisName}]`)
            if (inputFilter.length) {
                inputFilter.val(value)
            }
        })

        var wasteClassSelect = $('#waste_stock_class_select');
        wasteClassSelect.select2({
            placeholder: 'Todo',
            allowClear: true
        });

        var wasteTypeSelect = $('#waste_stock_type_select');
        wasteTypeSelect.select2({
            placeholder: 'Todo',
            allowClear: true
        });

        $('input[name=filter-wastespg]').on('change', function () {
            inputStatusWastes.val($(this).val())
            intermentWasteManagerTable.ajax.reload()
        })

        $('input[name=filter-residualpg]').on('change', function () {
            intermentWasteManagerTable.ajax.reload()
        })

        $('input[name=filter-selected-stock]').on('change', function () {
            intermentWasteManagerTable.ajax.reload()
        })

        $('select[name=company_select]').on('change', function () {
            intermentWasteManagerTable.ajax.reload()
        })

        // $('select[name=package_type_select]').on('change', function () {
        //     intermentWasteManagerTable.ajax.reload()
        // })

        $('select[name=waste_class_select]').on('change', function () {
            intermentWasteManagerTable.ajax.reload()

            let select = $(this)
            let url = select.data('url')
            let value = select.val()

            wasteTypeSelect.empty()
            wasteTypeSelect.append('<option></option>')

            if (value == '') {
                wasteTypeSelect.closest('.container-select').addClass('select-disabled')
            } else {
                wasteTypeSelect.closest('.container-select').addClass('select-disabled')
                $.ajax({
                    url: url,
                    method: 'GET',
                    data: {
                        value: value
                    },
                    dataType: 'JSON',
                    success: function (data) {

                        let wastes_types = data.wastes_types

                        $.each(wastes_types, function (key, value) {
                            wasteTypeSelect.append('<option value="' + value.id + '">' + value.name + '</option>')
                        })

                        wasteTypeSelect.closest('.container-select').removeClass('select-disabled')
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }

            wasteTypeSelect.select2({
                placeholder: 'Todo',
                allowClear: true
            });
        })

        $('select[name=waste_type_select]').on('change', function () {
            intermentWasteManagerTable.ajax.reload()
        })

        var intermentWasteManagerTableEle = $('#interment-wastes-table-manager');
        var getDataUrl = intermentWasteManagerTableEle.data('url');
        intermentWasteManagerTable = intermentWasteManagerTableEle.DataTable({
            responsive: true,
            order: [[3, 'desc']],
            language: DataTableEs,
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataUrl,
                "data": function (data) {
                    data.from_date = moment(fromDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD')
                    data.end_date = moment(toDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD')
                    data.table = "intGuide"
                    data.status = $('input[name=filter-wastespg]:checked').val()
                    data.selected = $('input[name=filter-selected-stock]:checked').val()

                    data.warehouse = warehouseFilter.val()
                    data.company = companyFilter.val()
                    data.code = codeFilter.val()
                    data.group = groupFilter.val()

                    // data.residue = $('input[name=filter-residualpg]:checked').val()
                    // data.company = $('select[name=company_select]').val()
                    // data.package = $('select[name=package_type_select]').val()
                    data.class = $('select[name=waste_class_select]').val()
                    data.type = $('select[name=waste_type_select]').val()
                }
            },
            columns: [
                // { data: 'choose', name: 'choose', orderable: false, searchable: false, className: 'not-export-col' },
                { data: null, render: DataTable.render.select(), orderable: false, className: 'not-export-col' },
                { data: 'id', name: 'id', orderable: false, searchable: false },
                { data: 'guide.id', name: 'guide.id' },
                { data: 'guide.code', name: 'guide.code', className: 'text-nowrap' },
                { data: 'guide.created_at', name: 'guide.created_at', className: 'text-nowrap' },
                { data: 'guide.warehouse.name', name: 'guide.warehouse.name' },
                { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' },
                { data: 'guide.warehouse.code', name: 'guide.warehouse.code' },
                { data: 'waste.name', name: 'waste.name' },
                { data: 'waste.classes_wastes.symbol', name: 'waste.classes_wastes.symbol', orderable: false, searchable: false },
                { data: 'waste.classes_wastes.group.name', name: 'waste.classes_wastes.group.name', orderable: false, searchable: false },
                { data: 'gestion_type', name: 'gestion_type' },///  TIPO DE GESTIÓN
                { data: 'aprox_weight', name: 'aprox_weight' },
                { data: 'stat_stock_bool', name: 'stat_stock_bool' },
                { data: 'stat_stock', name: 'stat_stock' },
                { data: 'action', name: 'action', className: 'action' }

                // { data: 'package.name', name: 'package.name' },
                // { data: 'package_quantity', name: 'package_quantity' },
                // { data: 'guide.warehouse.company.name', name: 'guide.warehouse.company.name' },
                // { data: 'guide.date_verified', name: 'guide.date_verified' },
                // { data: 'stat_departure', name: 'stat_departure', orderable: false, searchable: false },
                // { data: 'stat_arrival', name: 'stat_arrival', orderable: false, searchable: false },
                // { data: 'stat_transport_departure', name: 'stat_transport_departure' },
                // { data: 'disposition.status', name: 'disposition.status' },
            ],
            columnDefs: [
                { 'visible': false, 'targets': [1, 13] },
                // { 'orderable': false, 'targets': [0] }
            ],
            rowCallback: function (tr, rowData) {
                if (rowData['stat_stock_bool'] === 1) {
                    $(tr).addClass('unselectable');
                }
            },
            rowId: 'id',
            stateSave: true,
            select: {
                style: 'multi+shift',
                selector: 'td:first-child',
                selectable: function (rowData) {
                    return rowData['stat_stock_bool'] !== 1
                }
            },
            layout: {
                topStart: {
                    buttons: [
                        'pageLength'
                    ]
                }
            },
            // dom: 'Bfrtlip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         exportOptions: {
            //             columns: ':not(.not-export-col)'
            //         },
            //         title:    function () {
            //             var from_date = $('#daterange-btn-wastespg-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastespg-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastespg-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'El principio'};
            //              return 'DETALLE RESIDUOS VERIFICADOS - GESTOR: '+name+' - DESDE: '+from_date+ ' - ' + 'HASTA: ' + end_date;
            //         },
            //         filename: function () {
            //             var from_date = $('#daterange-btn-wastespg-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-wastespg-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastespg-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'todos'};
            //             return 'detalle-residuos-verificados_gestor-'+name+'_'+from_date+'_' + end_date + '_' + moment().format("hh-mm-ss");
            //         }
            //     }
            // ],
            // initComplete: function () {
            //     $.fn.dataTable.ext.search.push(
            //       function( settings, data, dataIndex ) {

            //         if ( settings.nTable.id !== 'interment-wastes-table-manager' ) {
            //           return true;
            //         }

            //         var min = moment($('#daterange-btn-wastespg-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
            //         var max = moment($('#daterange-btn-wastespg-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
            //         var startDate = moment(data[8]).toDate();
            //         if (min == null && max == null) { return true; }
            //         if (min == null && startDate <= max) { return true;}
            //         if(max == null && startDate >= min) {return true;}
            //         if (startDate <= max && startDate >= min) { return true; }
            //         return false;
            //       }
            //     );
            //   }
        });


        function saveSelectedStock({ table }) {
            let selected = table.select.cumulative().rows
            var btn_container = $('#btn-register-packing-guide-container');
            let url = btn_container.data('send')

            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    selected: selected
                },
                dataType: 'JSON',
                success: function (data) {
                    btn_container.html(data.html_button)
                },
                error: function (data) {
                    console.log(data)
                }
            })
        }

        intermentWasteManagerTable.on('select', function (e, dt, type, indexes) {
            saveSelectedStock({ table: intermentWasteManagerTable })
        })

        intermentWasteManagerTable.on('deselect', function (e, dt, type, indexes) {
            saveSelectedStock({ table: intermentWasteManagerTable })
        })


        intermentWasteManagerTable.on('draw.dt', function () {

            let weightCountStock = $('#total_weight_count_stock')
            let url = weightCountStock.data('url')

            // var startDate = $('#daterange-btn-wastespg-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')
            // var endDate = $('#daterange-btn-wastespg-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')
            // var equalValues = startDate == endDate

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    table: "intGuide",
                    from_date: moment(fromDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD'),
                    end_date: moment(toDatepickerinputStock.datepicker('getDate')).format('YYYY-MM-DD'),
                    status: $('input[name=filter-wastespg]:checked').val(),
                    selected: $('input[name=filter-selected-stock]:checked').val(),

                    warehouse: warehouseFilter.val(),
                    company: companyFilter.val(),
                    code: codeFilter.val(),
                    group: groupFilter.val(),

                    // residue: $('input[name=filter-residualpg]:checked').val(),
                    // company: $('select[name=company_select]').val(),
                    // package: $('select[name=package_type_select]').val(),
                    class: $('select[name=waste_class_select]').val(),
                    type: $('select[name=waste_type_select]').val()
                },
                success: function (data) {
                    weightCountStock.val(data.value.toLocaleString('en-US'))
                },
                error: function (data) {
                    console.log(data)
                }
            })
        });





        /* --------- STATUS FILTER GUIDES DEPARTURE -----------*/


        var packingGuideManagerTable

        var formDeparturesWastes = $('#form-departures-wastes-report')

        var inputFromDateDepartures = formDeparturesWastes.find('input[name=from_date]')
        var inputEndDateDepartures = formDeparturesWastes.find('input[name=end_date]')
        var inputStatusDepartures = formDeparturesWastes.find('input[name=status]')

        // * ------ FILTRO FECHA -------------

        let containerDaterangeDeparture = $('#departure-datepicker.datepicker-range-container.input-daterange')
        let input_max_date_depart = $('input#max_date_depart').val()
        let input_min_date_depart = $('input#min_date_depart').val()


        containerDaterangeDeparture.datepicker({
            language: 'es',
            orientation: "bottom auto"
        })

        var fromDatepickerinputDeparture = $('#fromDateSelectDeparture')
        var toDatepickerinputDeparture = $('#toDateSelectDeparture')

        containerDaterangeDeparture.find('input[name=fromDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date(input_min_date_depart))
                .on('hide', function (e) {

                    let prevValue = inputFromDateDepartures.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        packingGuideManagerTable.ajax.reload()
                    }

                    inputFromDateDepartures.val(date)
                    inputEndDateDepartures.val(moment(toDatepickerinputDeparture.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })
        containerDaterangeDeparture.find('input[name=toDate]').each(function () {
            let datepicker = $(this)
            datepicker.datepicker('setDate', new Date())
                .on('hide', function (e) {

                    let prevValue = inputEndDateDepartures.val()
                    let date = e.format(null, 'yyyy-mm-dd')

                    if (prevValue === '' || (prevValue !== '' && prevValue !== date)) {
                        packingGuideManagerTable.ajax.reload()
                    }

                    inputEndDateDepartures.val(date)
                    inputEndDateDepartures.val(moment(fromDatepickerinputDeparture.datepicker('getDate')).format('YYYY-MM-DD'))
                })
        })

        // * ----------------------------------

        // * ----- FILTERS ---------

        let groupFilterDeparture = $('#waste_group_select_departure')

        $('html').on('change', '.waste_departure_select', function () {
            packingGuideManagerTable.ajax.reload()
            let select = $(this)
            let thisName = select.attr('name')
            let value = select.val()

            let inputFilter = formDeparturesWastes.find(`input[name=${thisName}]`)
            if (inputFilter.length) {
                inputFilter.val(value)
            }
        })

        var wasteClassSelectDeparture = $('#waste_departure_class_select');
        wasteClassSelectDeparture.select2({
            placeholder: 'Todo',
            allowClear: true
        });

        var wasteTypeSelectDeparture = $('#waste_departure_type_select');
        wasteTypeSelectDeparture.select2({
            placeholder: 'Todo',
            allowClear: true
        });

        $('input[name=filter-wastes-departure]').on('change', function () {
            inputStatusDepartures.val($(this).val())
            packingGuideManagerTable.ajax.reload()
        })

        $('select[name=waste_class_select_departure]').on('change', function () {
            packingGuideManagerTable.ajax.reload()

            let select = $(this)
            let url = select.data('url')
            let value = select.val()

            wasteTypeSelectDeparture.empty()
            wasteTypeSelectDeparture.append('<option></option>')

            if (value == '') {
                wasteTypeSelectDeparture.closest('.container-select').addClass('select-disabled')
            } else {
                wasteTypeSelectDeparture.closest('.container-select').addClass('select-disabled')
                $.ajax({
                    url: url,
                    method: 'GET',
                    data: {
                        value: value
                    },
                    dataType: 'JSON',
                    success: function (data) {

                        let wastes_types = data.wastes_types

                        $.each(wastes_types, function (key, value) {
                            wasteTypeSelectDeparture.append('<option value="' + value.id + '">' + value.name + '</option>')
                        })

                        wasteTypeSelectDeparture.closest('.container-select').removeClass('select-disabled')
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }

            wasteTypeSelectDeparture.select2({
                placeholder: 'Todo',
                allowClear: true
            });
        })

        $('select[name=waste_type_select_departure]').on('change', function () {
            packingGuideManagerTable.ajax.reload()
        })

        var packingGuideManagerTableEle = $('#packing-guides-table-manager');
        var getDataPackingUrl = packingGuideManagerTableEle.data('url');
        packingGuideManagerTable = packingGuideManagerTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            order: [[11, 'desc']],
            serverSide: true,
            processing: true,
            ajax: {
                "url": getDataPackingUrl,
                "data": function (data) {
                    data.from_date = moment(fromDatepickerinputDeparture.datepicker('getDate')).format('YYYY-MM-DD')
                    data.end_date = moment(toDatepickerinputDeparture.datepicker('getDate')).format('YYYY-MM-DD')
                    data.table = "packing"
                    data.status = $('input[name=filter-wastes-departure]:checked').val()
                    data.group = groupFilterDeparture.val()
                    data.class = $('select[name=waste_class_select_departure]').val()
                    data.type = $('select[name=waste_type_select_departure]').val()
                }
            },
            columns: [
                // { data: 'choose', name: 'choose', orderable: false, searchable: false, className: 'not-export-col' },
                { data: null, render: DataTable.render.select(), orderable: false, className: 'not-export-col' },
                { data: 'id', name: 'id', orderable: false, searchable: false },
                { data: 'first_waste.guide.id', name: 'firstWaste.guide.id' },
                { data: 'cod_guide', name: 'cod_guide' },
                { data: 'first_waste.waste.classes_wastes.group.name', name: 'first_waste.waste.classes_wastes.group.name', orderable: false, searchable: false },
                { data: 'first_waste.waste.name', name: 'firstWaste.waste.name' },
                { data: 'wastes_sum_aprox_weight', name: 'wastes_sum_aprox_weight' },
                { data: 'volum', name: 'volum' },
                { data: 'inter_management.name', name: 'interManagement.name' },
                { data: 'status_bool', name: 'status_bool' },
                { data: 'status', name: 'status' },
                { data: 'date_guides_departure', name: 'date_guides_departure' },
                { data: 'year_month', name: 'year_month', orderable: false, searchable: false },
                { data: 'comment', name: 'comment' },
                { data: 'action', name: 'action', orderable: false, searchable: false, className: 'action' },
            ],
            columnDefs: [
                { 'visible': false, 'targets': [1, 9] }
            ],
            rowCallback: function (tr, rowData) {
                if (rowData['status_bool'] === 1) {
                    $(tr).addClass('unselectable');
                }
            },
            rowId: 'id',
            stateSave: true,
            select: {
                style: 'multi+shift',
                selector: 'td:first-child',
                selectable: function (rowData) {
                    return rowData['status_bool'] !== 1
                }
            },
            layout: {
                topStart: {
                    buttons: [
                        'pageLength'
                    ]
                }
            },
            // dom: 'Bfrtlip',
            // buttons: [
            //     {
            //         text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
            //         extend: 'excelHtml5',
            //         exportOptions: {
            //             columns: ':not(.not-export-col)'
            //         },
            //         title:    function () {
            //             var from_date = $('#daterange-btn-waste-departure-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-waste-departure-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastespg-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'El principio'};
            //              return 'DETALLE CARGA - GESTOR: '+name+' - DESDE: '+from_date+ ' - ' + 'HASTA: ' + end_date;
            //         },
            //         filename: function () {
            //             var from_date = $('#daterange-btn-waste-departure-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
            //             var end_date = $('#daterange-btn-waste-departure-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
            //             var name = $('#excel-generated-wastespg-info').data('name');
            //             if(from_date == '1970-01-01'){from_date = 'todos'};
            //             return 'detalle-carga_gestor-'+name+'_'+from_date+'_' + end_date + '_' + moment().format("hh-mm-ss");
            //         }
            //     }
            // ],
            // initComplete: function () {
            //     $.fn.dataTable.ext.search.push(
            //       function( settings, data, dataIndex ) {

            //         if ( settings.nTable.id !== 'packing-guides-table-manager' ) {
            //           return true;
            //         }

            //         var min = moment($('#daterange-btn-waste-departure-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
            //         var max = moment($('#daterange-btn-waste-departure-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
            //         var startDate = moment(data[14]).toDate();

            //         console.log(startDate)
            //         if (min == null && max == null) { return true; }
            //         if (min == null && startDate <= max) { return true;}
            //         if(max == null && startDate >= min) {return true;}
            //         if (startDate <= max && startDate >= min) { return true; }
            //         return false;
            //       }
            //     );
            //   }
        });

        function saveSelectedPackingGuide({ table }) {
            let selected = table.select.cumulative().rows
            var btn_container = $('#btn-update-departure-container');
            let url = btn_container.data('send')
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    selected: selected
                },
                dataType: 'JSON',
                success: function (data) {
                    btn_container.html(data.html_button)
                },
                error: function (data) {
                    console.log(data)
                }
            })
        }

        packingGuideManagerTable.on('select', function () {
            saveSelectedPackingGuide({ table: packingGuideManagerTable })
        })
        packingGuideManagerTable.on('deselect', function () {
            saveSelectedPackingGuide({ table: packingGuideManagerTable })
        })


        var transportTypeSelect = $('#transport-type-select');
        transportTypeSelect.select2({
            dropdownParent: $("#updateDeparturePgModal"),
            placeholder: 'Selecciona un transporte'
        });

        var destinationSelect = $('#destination-select');
        destinationSelect.select2({
            dropdownParent: $("#updateDeparturePgModal"),
            placeholder: 'Selecciona un destino'
        });

        // packingGuideManagerTable.on('draw.dt', function () {
        //     var btn_container = $('#btn-update-departure-container')
        //     btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
        //                             <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Realizar Manejo Interno </span>\
        //                         </div>');

        //     $('input[name="packingGuides-selected[]"]:checked').each(function () {
        //         $(this).prop('checked', false)
        //     })
        // });






        // ----------- REGISTER STOCK --------------

        var managementTypeSelect = $('#management-type-select');
        managementTypeSelect.select2({
            dropdownParent: $("#RegisterPackingGuideModal"),
            placeholder: 'Selecciona una opción'
        });

        // $('html').on('click', '.checkbox-guide-label', function () {
        //     var input = $('#' + $(this).attr('for'));
        //     // var status_array = [];
        //     // var status = false;

        //     var url = input.data('url')

        //     // if(!input.is(':checked')){
        //     //     status_array.push(input.data('status'))
        //     // }

        //     $.ajax({
        //         url: url,
        //         method: 'POST',
        //         data: {
        //             status: input.data('status'),
        //             checked: !input.is(':checked')
        //         },
        //         dataType: 'JSON',
        //         success: function (data) {
        //             var btn_container = $('#btn-register-packing-guide-container');
        //             btn_container.html(data.html_button)
        //         },
        //         error: function (data) {
        //             console.log(data)
        //         }
        //     })

        //     // $('input[name="guides-selected[]"]:checked').each(function(){
        //     //     if($(this).attr('id') != input.attr('id')){
        //     //         status_array.push($(this).data('status'))
        //     //     }
        //     // })

        //     // $.each(status_array, function(index, value){
        //     //     if(value == 1){
        //     //         status = false;
        //     //         return false;
        //     //     }else{
        //     //         status = true;
        //     //     }
        //     // })

        //     // var btn_container = $('#btn-register-packing-guide-container');

        //     // if(status){
        //     //     btn_container.html('<button id="btn-register-pg-modal" class="btn btn-primary"> \
        //     //                             <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Realizar Carga </span> \
        //     //                             <i class="fa-solid fa-spinner fa-spin loadSpinner"></i> \
        //     //                         </button>');
        //     // }else{
        //     //     btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
        //     //                             <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Realizar Carga </span>\
        //     //                         </div>');
        //     // }
        // })

        $('html').on('click', '#btn-register-pg-modal', function () {
            var button = $(this);
            var modal = $('#RegisterPackingGuideModal');
            var spinner = button.find('.loadSpinner');
            // var values = [];
            var url = $('#btn-register-packing-guide-container').data('url');
            var tbody = $('#t-body-guides-pg-manager')
            var weight_container = modal.find('#total-weight-pg-manager');
            var packages_container = modal.find('#total-packages-pg-manager');

            spinner.toggleClass('active');
            tbody.html('');
            weight_container.html('');
            packages_container.html('');

            // $('input[name="guides-selected[]"]:checked').each(function(){
            //     values.push($(this).val())
            // });

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "table": "packingGuide"
                },
                dataType: 'JSON',
                success: function (data) {

                    tbody.html(data.table)
                    // $.each(data['wastes'], function(key, values){

                    //     tbody.append('<tr> \
                    //                     <input name="guides-pg-ids[]" type="hidden" value="'+values.id+'"> \
                    //                     <td>'+values['guide'].code+'</td> \
                    //                     <td>'+values['waste']['classes_wastes'][0].symbol+'</td> \
                    //                     <td>'+values['waste'].name+'</td> \
                    //                     <td>'+values['package'].name+'</td> \
                    //                     <td>'+values.actual_weight+'</td> \
                    //                     <td>'+values.package_quantity+'</td> \
                    //                     <td>'+values['guide']['warehouse']['company'].name+'</td> \
                    //                     <td>'+values['guide'].date_verified+'</td> \
                    //                 </tr>');
                    // })

                    weight_container.html(data['weight']);
                    // packages_container.html(data['packages'])

                    spinner.toggleClass('active')
                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })

        $('#register-pg-manager-form').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            var spinner = form.find('.loadSpinner')
            var url = form.attr('action');
            var modal = $('#RegisterPackingGuideModal')
            var btn_container = $('#btn-register-packing-guide-container');

            Swal.fire({
                title: 'Confirmar',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {

                    spinner.toggleClass('active');

                    $.ajax({
                        method: form.attr('method'),
                        url: url,
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                text: '¡Carga realizada!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });

                            btn_container.html(data.html_button);

                            intermentWasteManagerTable.ajax.reload()
                            packingGuideManagerTable.ajax.reload()
                            spinner.toggleClass('active')
                            modal.modal('hide')

                            modal.find('input[name=code]').val('')
                            modal.find('input[name=volume]').val('')
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }
            }, function (dismiss) {
                return false;
            })

        })

        // ------------ EDIT STOCK ---------------

        var modal = $('#editGuideWasteModal')
        var form = modal.find('#editGuideWasteForm')

        var class_select = form.find('select[name=class_symbol]')
        var waste_type_select = form.find('select[name=waste_type]')
        var gestion_type_select = form.find('select[name=gestion_type]')

        class_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })
        waste_type_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })
        gestion_type_select.select2({
            dropdownParent: '#editGuideWasteForm'
        })

        $('html').on('click', '.editWaste', function () {

            let btn = $(this)
            let getData = btn.data('send')
            let url = btn.data('url')

            form.attr('action', url)
            class_select.empty()
            waste_type_select.empty()
            gestion_type_select.empty()

            $.ajax({
                method: 'GET',
                url: getData,
                dataType: 'JSON',
                success: function (data) {

                    let waste = data.waste
                    let guide = waste.guide
                    let classes = data.classes
                    let waste_class = data.waste_class
                    let gestion_types = data.gestion_types

                    form.find('#code_guide_waste').html(guide.code)

                    $.each(guide, function (key, value) {
                        let input = form.find("[name=" + key + "]");
                        if (input.length) {
                            input.val(value);
                        }
                    })

                    $.each(waste, function (key, value) {
                        let input = form.find("[name=" + key + "]");
                        if (input.length) {
                            input.val(value);
                        }
                    })

                    $.each(classes, function (key, value) {
                        class_select.append('<option value="' + value.id + '">' + value.symbol + '</option>')
                    })
                    class_select.val(waste_class.id).trigger("change");

                    $.each(waste_class.classes_wastes, function (key, value) {
                        waste_type_select.append(`<option value="${value.id}">${value.name}</option>`)
                    })
                    waste_type_select.val(waste.waste.id).trigger("change");

                    $.each(gestion_types, function (key, value) {
                        gestion_type_select.append(`<option value="${key}">${value}</option>`)
                    })
                    gestion_type_select.val(waste.gestion_type).trigger("change");

                    form.find('[name=volum]').val(waste.packing_guide == null ? '' : waste.packing_guide.volum)

                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        class_select.on('change', function () {
            if (modal.hasClass('show')) {

                let url = $(this).data('url')
                let value = class_select.val()

                waste_type_select.empty()

                $.ajax({
                    method: 'GET',
                    url: url,
                    data: {
                        id: value,
                        type: 'wasteClass'
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        let wasteTypes = data.wasteTypes

                        $.each(wasteTypes, function (key, value) {
                            waste_type_select.append(`<option value="${value.id}">${value.name}</option>`)
                        })
                    },
                    error: function (data) {
                        console.log(data)
                    }
                })
            }
        })

        $('#editGuideWasteForm').on('submit', function (e) {
            e.preventDefault()

            var form = $(this);
            var loadSpinner = form.find('.loadSpinner')
            var button = form.find('.btn-save')

            SwalConfirm.fire().then(function (e) {
                if (e.value === true) {

                    button.attr('disabled', 'disabled')
                    loadSpinner.toggleClass('active');

                    $.ajax({
                        type: form.attr('method'),
                        url: form.attr('action'),
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {

                            if (data.success) {

                                Toast.fire({
                                    icon: 'success',
                                    text: data.message
                                })
                                intermentWasteManagerTable.ajax.reload(null, false)

                                modal.modal('hide')
                            }
                            else {
                                ToastError.fire()
                            }
                        },
                        complete: function (data) {
                            button.removeAttr('disabled')
                            loadSpinner.toggleClass('active')
                        },
                        error: function (data) {
                            console.log(data)
                        }
                    })

                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })
        })

        // ------------ DELETE STOCK ---------------

        $('html').on('click', '.deleteWaste', function () {

            let button = $(this)
            let url = button.data('url')

            SwalDelete.fire().then(function (e) {
                if (e.value === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: url,
                        dataType: 'JSON',
                        success: function (result) {

                            if (result.success) {

                                Toast.fire({
                                    icon: 'success',
                                    text: result.message
                                })
                                intermentWasteManagerTable.ajax.reload(null, false);
                            } else {
                                ToastError.fire()
                            }
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    });
                } else {
                    e.dismiss;
                }
            }, function (dismiss) {
                return false;
            })

        })




        // $('html').on('click', '.checkbox-packingGuide-label', function () {

        //     var input = $('#' + $(this).attr('for'));
        //     var status_array = [];
        //     var status = false;
        //     if (!input.is(':checked')) {
        //         status_array.push(input.data('status'))
        //     }

        //     $('input[name="packingGuides-selected[]"]:checked').each(function () {
        //         if ($(this).attr('id') != input.attr('id')) {
        //             status_array.push($(this).data('status'))
        //         }
        //     })

        //     $.each(status_array, function (index, value) {
        //         if (value == 1) {
        //             status = false;
        //             return false;
        //         } else {
        //             status = true;
        //         }
        //     })

        //     var btn_container = $('#btn-update-departure-container');

        //     if (status) {
        //         btn_container.html('<button id="btn-update-departure-modal" class="btn btn-primary"> \
        //                                 <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Realizar Manejo Interno </span> \
        //                                 <i class="fa-solid fa-spinner fa-spin loadSpinner"></i> \
        //                             </button>');
        //     } else {
        //         btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
        //                                 <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Realizar Manejo Interno </span>\
        //                             </div>');
        //     }
        // })

        /* --------------- PARTITION STOCK WASTES -------------  */


        $('html').on('click', '.btn-show-stock-part-modal', function () {

            var modal = $('#RegisterStockPartitionModal')
            var url_data = $(this).data('get')
            var form = modal.find('#store-partitions-stock-form')

            var buttonSave = form.find('span.btn-add-partitions')
            var url = $(this).data('url')

            var partitionNumberInput = form.find('input[name=partitions_number]')

            form.trigger('reset')
            partitionNumberInput.val(1)

            var table_container = form.find('.table-stock-partition-container')
            var partitions_container = form.find('.stock-partitions-container')
            var sale_container = form.find(".sale-stock-partitions-container")
            var altert_container = form.find('.alert-stock-partitions-container')

            table_container.empty()
            partitions_container.empty()
            sale_container.empty()
            altert_container.empty()

            $.ajax({
                type: 'GET',
                url: url_data,
                dataType: 'JSON',
                success: function (data) {

                    form.attr('action', url)
                    table_container.html(data.html)

                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        if ($('#store-partitions-stock-form').length) {

            function getPartitionContent(index) {
                return '<div class="form-row row-general-partition">\
                            <div class="form-group col-lg-5 col-md-7 col-10 row-group-partition">\
                                <div class="text-nowrap font-weight-bold">\
                                    Partición\
                                    <span class="font-weight-bold index-row-partition">\
                                        '+ (index + 1) + '\
                                    </span>\
                                    :\
                                </div>\
                                <input type="number" class="form-control text-right no-arrows required-input" name="partitions_qtty[]" min="0" step="0.1">\
                                <div class="font-weight-bold">\
                                    Kg.\
                                </div>\
                            </div>\
                            <div class="form-group col-lg-1 col-2">\
                                <span class="form-control btn btn-danger btn-remove-partition">\
                                    <i class="fa-solid fa-trash-can"></i>\
                                </span>\
                            </div>\
                        </div>'
            }

            function getSaleContent(sale) {
                return '<div class="form-row d-flex">\
                            <div class="form-group col-lg-5 col-md-7 col-10 text-right">\
                                <div class="text-nowrap font-weight-bold">\
                                    Saldo:\
                                    <span class="stock-sale-qtty">\
                                        '+ sale + '\
                                    </span>\
                                    <span>\
                                        Kg.\
                                    </span>\
                                </div>\
                            </div>\
                        </div>'
            }

            function getAlertContent() {
                return '<span class="badge badge-pill badge-warning">\
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>\
                            La cantidad ingresada superó el peso total del residuo.\
                        </span>'
            }

            var formStockPart = $('#store-partitions-stock-form')
            var partitionNumberInput = formStockPart.find('input[name=partitions_number]')
            var buttonSave = formStockPart.find('span.btn-add-partitions')

            partitionNumberInput.on('keypress', function (e) {
                var charCode = e.which ? e.which : e.keyCode;
                if ((charCode < 48 || charCode > 57)) {
                    e.preventDefault();
                }
                else {
                    buttonSave.removeClass('disabled')
                    buttonSave.addClass('btn-valid-load-partitions')
                }
            })

            partitionNumberInput.on('input', function (e) {
                if ($(this).val() === "" || $(this).val() <= 0) {
                    buttonSave.addClass('disabled')
                    buttonSave.removeClass('btn-valid-load-partitions')
                }
            })

            partitionNumberInput.on("key blur", function () {
                var sanitizedValue = $(this).val().replace(/[^0-9]/g, '');
                $(this).val(sanitizedValue);
                if ($(this).val() === "" || $(this).val() <= 0) {
                    buttonSave.addClass('disabled')
                    buttonSave.removeClass('btn-valid-load-partitions')
                } else {
                    buttonSave.removeClass('disabled')
                    buttonSave.addClass('btn-valid-load-partitions')
                }
            })

            var partitionsContainer = formStockPart.find('.stock-partitions-container')

            $('html').on('click', '.btn-valid-load-partitions', function () {

                var partitionNumberInput = formStockPart.find('input[name=partitions_number]')
                var partitions_container = formStockPart.find('.stock-partitions-container')

                var loaded_part_containers = partitions_container.find('.row-general-partition').length

                if (partitionNumberInput.val()) {

                    var partitions_value = partitionNumberInput.val()

                    for (var i = loaded_part_containers; i < partitions_value; i++) {
                        partitions_container.append(getPartitionContent(i))
                    }

                    // sale_container.html(getSaleContent(sale_weigth_waste))
                }

            })

            $('html').on('click', '.btn-remove-partition', function () {
                var parent = $(this).closest('.row-general-partition')
                var container_partitions = parent.closest('.stock-partitions-container')
                var sale_container = formStockPart.find('.sale-stock-partitions-container')
                var alert_container = formStockPart.find('.alert-stock-partitions-container')
                var sale_weigth_waste = +$('#total-weight-waste-partition').text()

                parent.remove()

                var sum_partitions = 0

                $.each(container_partitions.find('.row-general-partition'), function (key, row) {
                    $(this).find('.index-row-partition').html(key + 1)
                    sum_partitions += +$(this).find('input[name="partitions_qtty[]"]').val()
                })

                sale_weigth_waste = sale_weigth_waste - sum_partitions

                if (sale_weigth_waste < 0) {
                    sale_container.html(getSaleContent(0))
                    alert_container.html(getAlertContent())
                } else {
                    sale_container.html(getSaleContent(+sale_weigth_waste.toFixed(2)))
                    alert_container.empty()
                }
            })

            $('html').on('input', 'input[name="partitions_qtty[]"]', function () {

                var parentPartitionsContainer = $(this).closest('.stock-partitions-container')
                var btn_save_form = $('#store-partitions-stock-form').find('.btn-save')
                var sale_container = formStockPart.find('.sale-stock-partitions-container')
                var alert_container = formStockPart.find('.alert-stock-partitions-container')

                var sale_weigth_waste = +$('#total-weight-waste-partition').text()

                var sumValuesPartitions = 0

                $.each(parentPartitionsContainer.find('.row-general-partition'), function (key, row) {
                    sumValuesPartitions += +(+$(this).find('input[name="partitions_qtty[]"]').val()).toFixed(2)
                })

                sale_weigth_waste = sale_weigth_waste - sumValuesPartitions

                if (sale_weigth_waste < 0) {
                    sale_container.html(getSaleContent(0))
                    alert_container.html(getAlertContent())
                    btn_save_form.addClass('disabled')
                } else {
                    sale_container.html(getSaleContent(+sale_weigth_waste.toFixed(2)))
                    alert_container.empty()
                    btn_save_form.removeClass('disabled')
                }
            })

            formStockPart.on('submit', function (e) {
                e.preventDefault()

                var modal = $('#RegisterStockPartitionModal')
                var form = $(this)
                var required_input_length = form.find('.required-input').length
                var btn_save = form.find('.btn-save')
                var spinner = btn_save.find('.loadSpinner')
                var passValidation = validateInputForm(form)

                if (required_input_length == 0) { passValidation = false }

                if (passValidation && !(btn_save.hasClass('disabled'))) {

                    SwalConfirm.fire().then(function (e) {
                        if (e.value === true) {

                            btn_save.addClass('disabled')
                            spinner.toggleClass('active')

                            $.ajax({
                                type: form.attr('method'),
                                url: form.attr('action'),
                                data: form.serialize(),
                                dataType: 'JSON',
                                success: function (data) {
                                    if (data.success) {

                                        Toast.fire({
                                            icon: 'success',
                                            text: data.message
                                        })

                                        intermentWasteManagerTable.ajax.reload(null, false)
                                        packingGuideManagerTable.ajax.reload(null, false)

                                        modal.modal('hide')
                                    }
                                    else {
                                        ToastError.fire()
                                    }
                                },
                                complete: function (data) {
                                    btn_save.removeClass('disabled')
                                    spinner.toggleClass('active')
                                },
                                error: function (data) {
                                    console.log(data)
                                }
                            })

                        } else {
                            e.dismiss;
                        }
                    }, function (dismiss) {
                        return false;
                    })
                }
                else {
                    Swal.fire({
                        toast: true,
                        icon: 'warning',
                        title: 'Advertencia:',
                        text: '¡Rellena el formulario para continuar!',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                }
            })
        }




        $('html').on('click', '.btn-show-packingGuide', function (e) {
            e.preventDefault();
            var button = $(this);
            var url = button.data('url');
            var modal = $('#showPackingGuideDetailModal');
            var tablePgBody = $('#t-body-show-packing-guide-manager');
            var tableIntGuideBody = $('#t-body-int-guides-manager');

            tablePgBody.html('');
            tableIntGuideBody.html('');

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "table": "packingGuide"
                },
                dataType: 'JSON',
                success: function (data) {

                    tablePgBody.html(data.html_pg)
                    tableIntGuideBody.html(data.html_wastes)

                    modal.modal('show');
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })

        $('html').on('click', '#btn-update-departure-modal', function () {
            var button = $(this);
            var modal = $('#updateDeparturePgModal');
            var spinner = button.find('.loadSpinner');
            var url = $('#btn-update-departure-container').data('url');
            var tbody = $('#t-body-guides-departure-manager');

            // var values = [];

            spinner.toggleClass('active');
            tbody.html('');

            // $('input[name="packingGuides-selected[]"]:checked').each(function () {
            //     values.push($(this).val())
            // });

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "table": "departure"
                },
                dataType: 'JSON',
                success: function (data) {
                    tbody.html(data.html)
                    modal.modal('show');
                },
                complete: function (data) {
                    spinner.toggleClass('active');
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        $('#updateDeparture-pg-manager-form').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            var url = form.attr('action');
            var modal = $('#updateDeparturePgModal');
            var spinner = modal.find('.loadSpinner');
            var button_update_container = $('#btn-update-departure-container')

            Swal.fire({
                title: 'Confirmar',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {

                    spinner.toggleClass('active');

                    $.ajax({
                        method: form.attr('method'),
                        url: url,
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                text: '¡Salida efectuada!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });

                            button_update_container.html(data.html_button);

                            intermentWasteManagerTable.ajax.reload(null, false)
                            packingGuideManagerTable.ajax.reload(null, false)
                            spinner.toggleClass('active');
                            modal.modal('hide');

                            modal.find('select[name=transport-type]').val('').trigger('change')
                            modal.find('select[name=destination]').val('').change()
                            modal.find('input[name=n-guideppc]').val('')
                            modal.find('input[name=n-manifest]').val('')
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }
            }, function (dismiss) {
                return false;
            })
        })

        $('html').on('click', '.edit_packing_guide', function (e) {

            var modal = $('#edit_updateDeparturePgModal')
            var send = $(this).data('send')
            var url = $(this).data('url')
            var form = modal.find('#edit-updateDeparture-pg-manager-form')

            $.ajax({
                url: send,
                method: 'GET',
                dataType: 'JSON',
                success: function (data) {
                    form.attr('action', url)

                    var container = form.find('#edit_pg_form_container')
                    container.html(data.html)

                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

        $('#edit-updateDeparture-pg-manager-form').on('submit', function (e) {
            e.preventDefault()

            var form = $(this)
            var button = form.find('.btn-save')
            var loadSpinner = button.find('.loadSpinner')

            button.addClass('disabled')
            loadSpinner.addClass('active')
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                method: 'POST',
                dataType: 'JSON',
                success: function (data) {

                    var modal = $('#edit_updateDeparturePgModal')
                    if (data.success) {
                        Toast.fire({
                            icon: "success",
                            text: data.message
                        })
                    }
                    else {
                        Toast.fire({
                            icon: "error",
                            text: data.message
                        })
                    }

                    modal.modal('hide')
                    packingGuideManagerTable.ajax.reload(null, false)
                },
                complete: function (data) {
                    button.removeClass('disabled')
                    loadSpinner.removeClass('active')
                },
                error: function (data) {
                    ToastError.fire()
                    console.log(data)
                }
            })
        })
    }





    /* ------------- DEPARTURES -------------*/

    if ($('#daterange-btn-departures-manager').length) {

        let input_max_date = $('input#max_date').val()
        let input_min_date = $('input#min_date').val()

        let end = moment(input_max_date, "YYYY-MM-DD HH:mm:ss").add(1, 'days');
        let start = moment(input_min_date, "YYYY-MM-DD HH:mm:ss")

        $('#date-range-input-departures').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

        $('#daterange-btn-departures-manager').daterangepicker({
            startDate: start,
            endDate: end,
            showDropdowns: true,
        }, function (start, end) {

            $('#date-range-input-departures').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

            departuresManagerTable.draw()
        });
    }


    if ($('#departures-table-manager').length) {

        var ppcGuideSelect = $('#ppc_guide_select');
        ppcGuideSelect.select2({
            placeholder: 'Selecciona una guía PPC',
            allowClear: true
        });

        var manifestSelect = $('#manifest_select');
        manifestSelect.select2({
            placeholder: 'Selecciona un manifiesto',
            allowClear: true
        });

        var wasteDepartureSelect = $('#waste_departure_select');
        wasteDepartureSelect.select2({
            placeholder: 'Selecciona un registro de salida',
            allowClear: true
        });

        var transportSelect = $('#transport_select');
        transportSelect.select2({
            placeholder: 'Selecciona un transporte',
            allowClear: true
        });

        var destinationSelect = $('#destination_select');
        destinationSelect.select2({
            placeholder: 'Selecciona un destino',
            allowClear: true
        });

        var guideGcSelect = $('#guide_gc_select');
        guideGcSelect.select2({
            placeholder: 'Selecciona una Guía GC Puerto',
            allowClear: true
        });

        var waste_name_select = $('#waste_name_select');
        waste_name_select.select2({
            placeholder: 'Selecciona un residuo',
            allowClear: true
        })

        $('input[name=filter-departures-stat-arrival]').on('change', function () {
            departuresManagerTable.column(14).search($(this).val()).draw()
        })

        $('select[name=ppc_guide_select]').on('change', function () {
            departuresManagerTable.column(1).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=manifest_select]').on('change', function () {
            departuresManagerTable.column(2).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=waste_departure_select]').on('change', function () {
            departuresManagerTable.column(3).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=transport_select]').on('change', function () {
            departuresManagerTable.column(7).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=destination_select]').on('change', function () {
            departuresManagerTable.column(8).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=guide_gc_select]').on('change', function () {
            departuresManagerTable.column(10).search($(this).val(), { exact: true }).draw()
        })

        $('select[name=waste_name_select]').on('change', function () {
            departuresManagerTable.column(5).search($(this).val(), { exact: true }).draw()
        })

        // $('input[name=filter-departures-stat-departure]').on('change', function(){
        //     departuresManagerTable.column(11).search($(this).val()).draw()
        // })

        /* --------- CHECKBOX FILTER ---------*/

        $('html').on('click', '.checkbox-waste-label', function () {
            var input = $('#' + $(this).attr('for'));
            var status_arrival_array = []
            var status_departure_array = []

            var status_arrival = false;
            var status_departure = false;
            if (!input.is(':checked')) {
                status_arrival_array.push(input.data('status-arrival'))
                // status_departure_array.push([input.data('status-arrival'), input.data('status-departure')])
            }

            $('input[name="departures-selected[]"]:checked').each(function () {
                if ($(this).attr('id') != input.attr('id')) {
                    status_arrival_array.push($(this).data('status-arrival'))
                    // status_departure_array.push([$(this).data('status-arrival'), $(this).data('status-departure')])
                }
            })

            $.each(status_arrival_array, function (index, value) {
                if (value == 1) {
                    status_arrival = false;
                    return false;
                } else {
                    status_arrival = true;
                }
            })

            $.each(status_arrival_array, function (index, value) {
                if (value == 0) {
                    status_departure = false;
                    return false;
                } else {
                    status_departure = true;
                }
            })

            var btn_container = $('#btn-register-arrival-container');
            var btn_departure_container = $('#btn-register-departure-container');

            if (status_arrival) {
                btn_container.html('<button id="btn-register-arrival-modal" class="btn btn-primary"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar llegada </span> \
                                        <i class="fa-solid fa-spinner fa-spin loadSpinner"></i> \
                                    </button>');
            } else {
                btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar llegada </span>\
                                    </div>');
            }

            if (status_departure) {
                btn_departure_container.html('<button id="btn-register-departure-modal" class="btn btn-primary"> \
                                                <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar salida </span> \
                                                <i class="fa-solid fa-spinner fa-spin loadSpinner"></i> \
                                            </button>')
            } else {
                btn_departure_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                                <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar salida </span>\
                                            </div>')
            }
        })

        var departuresManagerTableEle = $('#departures-table-manager');
        var getDataUrl = departuresManagerTableEle.data('url');
        var departuresManagerTable = departuresManagerTableEle.DataTable({
            responsive: true,
            order: [[9, 'desc']],
            language: DataTableEs,
            ajax: {
                "url": getDataUrl
            },
            columns: [
                { data: 'choose', name: 'choose', orderable: false, searchable: false, className: 'not-export-col' },
                { data: 'ppc_code', name: 'ppc_code' },
                { data: 'manifest_code', name: 'manifest_code' },
                { data: 'cod_guide', name: 'cod_guide' },
                { data: 'waste_class', name: 'waste_class' },
                { data: 'waste_type', name: 'waste_type' }, // 5
                { data: 'total_weight', name: 'total_weight' }, // 6
                { data: 'shipping_type', name: 'shipping_type' }, // 7
                { data: 'destination', name: 'destination' },
                { data: 'date_departure', name: 'date_departure' }, // 9

                { data: 'gc_code', name: 'gc_code' },
                { data: 'date_arrival', name: 'date_arrival' },
                { data: 'date_retirement', name: 'date_retirement' },

                { data: 'status', name: 'status' },
                { data: 'stat_arrival', name: 'stat_arrival' } // 14
                // {data: 'stat_transport_departure', name:'stat_transport_departure'}
            ],
            // columnDefs : [
            //     { 'visible': false, 'targets': [10,11,12,13,14,15,16,17,18] }
            // ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)'
                    },
                    title: function () {
                        var from_date = $('#daterange-btn-departures-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-departures-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-departures-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'El principio', end_date = 'El final' };
                        return 'DETALLE TRANSPORTE - GESTOR: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
                    },
                    filename: function () {
                        var from_date = $('#daterange-btn-departures-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-departures-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-departures-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'todos', end_date = 'todos' };
                        return 'detalle-transporte_gestor-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
                    }
                }
            ],
            initComplete: function () {
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {

                        if (settings.nTable.id !== 'departures-table-manager') {
                            return true;
                        }

                        var min = moment($('#daterange-btn-departures-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
                        var max = moment($('#daterange-btn-departures-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
                        var startDate = moment(data[9]).toDate();
                        if (min == null && max == null) { return true; }
                        if (min == null && startDate <= max) { return true; }
                        if (max == null && startDate >= min) { return true; }
                        if (startDate <= max && startDate >= min) { return true; }
                        return false;
                    }
                );
            }
        })

        departuresManagerTable.on('draw.dt', function () {
            var btn_container = $('#btn-register-arrival-container')
            var btn_departure_container = $('#btn-register-departure-container');
            btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar llegada </span>\
                                </div>');
            btn_departure_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                            <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Dar salida </span>\
                                        </div>')

            $('input[name="departures-selected[]"]:checked').each(function () {
                $(this).prop('checked', false)
            })

            let weightCountDeparture = $('#total_weight_count_departure')
            let url = weightCountDeparture.data('url')

            var startDate = $('#daterange-btn-departures-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')
            var endDate = $('#daterange-btn-departures-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')
            var equalValues = startDate == endDate

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    table: "departure",
                    from_date: equalValues ? null : startDate,
                    end_date: equalValues ? null : endDate,
                    status: $('input[name=filter-departures-stat-arrival]:checked').val(),
                    ppc_guide: $('select[name=ppc_guide_select]').val(),
                    manifest: $('select[name=manifest_select]').val(),
                    waste_departure: $('select[name=waste_departure_select]').val(),
                    transport: $('select[name=transport_select]').val(),
                    destination: $('select[name=destination_select]').val(),
                    guide_gc: $('select[name=guide_gc_select]').val(),
                    waste: $('select[name=waste_name_select]').val()
                },
                success: function (data) {
                    weightCountDeparture.val(data.value)
                },
                error: function (data) {
                    console.log(data)
                }
            })
        });

        /* ----------- SHOW DEPARTUE DETAIL ------------ */


        // $('html').on('click', '.btn-show-departure', function (e) {
        //     e.preventDefault()

        //     var url = $(this).data('url')

        //     var modal = $('#showDepartureDetailModal')
        //     var container = modal.find('#departure_detail_content')

        //     $.ajax({
        //         type: 'GET',
        //         url: url,
        //         dataType: 'JSON',
        //         success: function (data) {

        //             container.html(data.html)
        //             modal.modal('show')

        //         },
        //         error: function (data) {
        //             console.log(data)
        //         }
        //     })
        // })

        $('html').on('click', '.btn-show-packingGuide', function (e) {
            e.preventDefault();
            var button = $(this);
            var url = button.data('url');
            var modal = $('#showPackingGuideDetailModal');
            var tablePgBody = $('#t-body-show-packing-guide-manager');
            var tableIntGuideBody = $('#t-body-int-guides-manager');

            tablePgBody.html('');
            tableIntGuideBody.html('');

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "table": "packingGuide"
                },
                dataType: 'JSON',
                success: function (data) {


                    tablePgBody.html(data.html_pg)
                    tableIntGuideBody.html(data.html_wastes)

                    modal.modal('show');
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })


        /* --------- REGISTER ARRIVAL -----------*/

        $('html').on('click', '#btn-register-arrival-modal', function () {

            var button = $(this);
            var modal = $('#RegisterArrivalModal');
            var spinner = button.find('.loadSpinner');
            var values = [];
            var url = $('#btn-register-arrival-container').data('url');
            var tbody = $('#t-body-arrival-wastes-manager')

            spinner.toggleClass('active');
            tbody.html('');

            $('input[name="departures-selected[]"]:checked').each(function () {
                values.push($(this).val())
            });

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "values": values,
                    "table": "arrival"
                },
                dataType: 'JSON',
                success: function (data) {

                    /* ----------------------------------------------------*/
                    tbody.html(data.html)
                    // $.each(data['departures'], function(key, values){

                    //     tbody.append('<tr> \
                    //                     <input name="departures-arrival-ids[]" type="hidden" value="'+values.id+'"> \
                    //                     <td>'+values.ppc_code+'</td> \
                    //                     <td>'+values.manifest_code+'</td> \
                    //                     <td>'+values.cod_guide+'</td> \
                    //                     <td>'+values.wastes_sum_actual_weight+'</td> \
                    //                     <td>'+values.wastes_sum_package_quantity+'</td> \
                    //                     <td>'+(values.volum == null ? "-" : values.volum)+'</td> \
                    //                     <td>'+values.shipping_type+'</td> \
                    //                     <td>'+values.destination+'</td> \
                    //                     <td>'+values.date_departure+'</td> \
                    //                 </tr>');
                    // })

                    modal.modal('show')
                },
                complete: function (data) {
                    spinner.toggleClass('active')
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })

        $('#register-arrival-form').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            var spinner = form.find('.loadSpinner')
            var url = form.attr('action');
            var modal = $('#RegisterArrivalModal')
            var btn_container = $('#btn-register-arrival-container');

            Swal.fire({
                title: 'Confirmar',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {

                    spinner.toggleClass('active');

                    $.ajax({
                        method: form.attr('method'),
                        url: url,
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                text: '¡Registrado exitosamente!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });

                            btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                                <i class="fa-solid fa-square-plus"></i> &nbsp; Dar llegada \
                                            </div>');

                            departuresManagerTable.ajax.reload(null, false)
                            spinner.toggleClass('active')
                            modal.modal('hide')

                            modal.find('input[name=n-guide-gc]').val('')
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }
            }, function (dismiss) {
                return false;
            })


        })


        $('html').on('click', '.checkbox-wastes-disposition', function () {
            var input = $('#' + $(this).attr('for'));
            var status_departure_array = []

            var form = $(this).closest('form')
            var status_departure = false;

            if (!input.is(':checked')) {
                status_departure_array.push($(this).data('status-disposition'))
            }

            $('input[name="wastes-disposition-selected[]"]:checked').each(function () {
                if ($(this).attr('id') != input.attr('id')) {
                    status_departure_array.push($(this).data('status-disposition'))
                }
            })

            $.each(status_departure_array, function (index, value) {
                if (value == 1) {
                    status_departure = false;
                    return false;
                } else {
                    status_departure = true;
                }
            })

            var button = form.find('button[type=submit]')

            if (!status_departure) {
                button.addClass('disabled')
            } else {
                button.removeClass('disabled')
            }

        })


        /* ------------ REGISTER DEPARTURE - DISPOSITION ------------*/

        $('html').on('click', '#btn-register-departure-modal', function () {

            var button = $(this);
            var modal = $('#RegisterDepartureModal');
            var button_submit = modal.find('button[type=submit]')
            var spinner = button.find('.loadSpinner');
            var values = [];
            var url = $('#btn-register-departure-container').data('url');
            var html_container = modal.find('#wastes-selected-departure-manager-table')

            spinner.toggleClass('active');
            html_container.html('');

            button_submit.addClass('disabled')

            $('input[name="departures-selected[]"]:checked').each(function () {
                values.push($(this).val())
            });

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "values": values
                },
                dataType: 'JSON',
                success: function (data) {

                    /* ----------------------------------------------------*/
                    html_container.html(data.html)

                    modal.modal('show')
                },
                complete: function (data) {
                    spinner.toggleClass('active')
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })

        $('#register-departure-form').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            var spinner = form.find('.loadSpinner')
            var url = form.attr('action');
            var modal = $('#RegisterDepartureModal')
            var btn_container = $('#btn-register-departure-container');

            Swal.fire({
                title: 'Confirmar',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {

                    spinner.toggleClass('active');

                    $.ajax({
                        method: form.attr('method'),
                        url: url,
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                text: '¡Registrado exitosamente!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });

                            btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                                <i class="fa-solid fa-square-plus"></i> &nbsp; Dar salida \
                                            </div>');

                            departuresManagerTable.ajax.reload(null, false)

                            modal.modal('hide')

                            modal.find('input[name=destination]').val('')
                            modal.find('input[name=plate]').val('')
                            modal.find('input[name=n-green-care-guide]').val('')
                            modal.find('input[name=retrieved-weight]').val('')
                            modal.find('input[name=weight-diff]').val('')

                        },
                        complete: function (data) {
                            spinner.toggleClass('active')
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }
            }, function (dismiss) {
                return false;
            })


        })

    }


    // * ------------ DISPOSITIONS --------------

    if ($('#daterange-btn-dispositions-manager').length) {

        let input_max_date = $('input#max_date').val()
        let input_min_date = $('input#min_date').val()

        let end = moment(input_max_date, "YYYY-MM-DD HH:mm:ss").add(1, 'days');
        let start = moment(input_min_date, "YYYY-MM-DD HH:mm:ss")

        $('#date-range-input-dispositions').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

        $('#daterange-btn-dispositions-manager').daterangepicker({
            startDate: start,
            endDate: end,
        }, function (start, end) {

            $('#date-range-input-dispositions').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));

            dispositionManagerTable.draw()
        });
    }

    if ($('#dispositions-table-manager').length) {

        var guide_gc_select = $('#guide_gc_select');
        guide_gc_select.select2({
            placeholder: 'Selecciona una Guía Green Care',
            allowClear: true
        });

        var destination_select = $('#destination_select');
        destination_select.select2({
            placeholder: 'Selecciona un destino',
            allowClear: true
        });

        var plate_select = $('#plate_select');
        plate_select.select2({
            placeholder: 'Selecciona una placa de camión',
            allowClear: true
        });

        var wasteSelect = $('#waste_name_select');
        wasteSelect.select2({
            placeholder: 'Selecciona un residuo',
            allowClear: true
        });


        $('input[name=filter-departures-stat-disposition]').on('change', function () {
            dispositionManagerTable.column(19).search($(this).val()).draw()
        });

        $('select[name=guide_gc_select]').on('change', function () {
            dispositionManagerTable.column(1).search($(this).val(), { exact: true }).draw()
        });

        $('select[name=destination_select]').on('change', function () {
            dispositionManagerTable.column(5).search($(this).val(), { exact: true }).draw()
        });

        $('select[name=plate_select]').on('change', function () {
            dispositionManagerTable.column(6).search($(this).val(), { exact: true }).draw()
        });

        $('select[name=waste_name_select]').on('change', function () {
            dispositionManagerTable.column(3).search($(this).val(), { exact: true }).draw()
        });


        // * --------- CHECKBOX FILTER --------- */

        $('html').on('click', '.checkbox-waste-label', function () {
            var input = $('#' + $(this).attr('for'));
            var status_disposition_array = []

            var status_disposition = false;

            if (!input.is(':checked')) {
                status_disposition_array.push(input.data('status-disposition'))
            }

            $('input[name="dispositions-selected[]"]:checked').each(function () {
                if ($(this).attr('id') != input.attr('id')) {
                    status_disposition_array.push($(this).data('status-disposition'))
                }
            })

            $.each(status_disposition_array, function (index, value) {
                if (value == 1) {
                    status_disposition = false;
                    return false;
                } else {
                    status_disposition = true;
                }
            })

            var btn_container = $('#btn-register-disposition-container');

            if (status_disposition) {
                btn_container.html('<button id="btn-register-disposition-modal" class="btn btn-primary"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Disposición </span> \
                                        <i class="fa-solid fa-spinner fa-spin loadSpinner"></i> \
                                    </button>');
            } else {
                btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Disposición </span>\
                                    </div>');
            }
        })

        // * ------------ TABLE -------------- */

        var dispositionsManagerTableEle = $('#dispositions-table-manager');
        var getDataUrl = dispositionsManagerTableEle.data('url');
        var dispositionManagerTable = dispositionsManagerTableEle.DataTable({
            responsive: true,
            order: [[8, 'desc']],
            language: DataTableEs,
            ajax: {
                "url": getDataUrl
            },
            columns: [
                { data: 'choose', name: 'choose', orderable: false, searchable: false, className: 'not-export-col' },
                { data: 'code_green_care', name: 'code_green_care' },
                { data: 'waste_class', name: 'waste_class' },
                { data: 'waste_type', name: 'waste_type' }, // 3
                { data: 'total_weight', name: 'total_weight' },
                { data: 'destination', name: 'destination' },
                { data: 'plate_init', name: 'plate_init' },
                { data: 'weigth_init', name: 'weigth_init' },
                // {data: 'weigth_diff_init', name:'weigth_diff_init'},
                { data: 'date_departure', name: 'date_departure' }, // 8

                { data: 'code_dff', name: 'code_dff' }, // * 9
                { data: 'weigth', name: 'weigth' }, // 10
                { data: 'weigth_diff', name: 'weigth_diff' }, // 11
                { data: 'disposition_place', name: 'disposition_place' }, // 12
                { data: 'code_invoice', name: 'code_invoice' }, // 13
                { data: 'code_certification', name: 'code_certification' }, // 14
                { data: 'plate', name: 'plate' }, // 15
                { data: 'managment_report', name: 'managment_report' }, // 16
                { data: 'observations', name: 'observations' }, // 17
                { data: 'date_dff', name: 'date_dff' }, // * 18

                // {data: 'waste.name', name:'waste.name', orderable: false},
                // {data: 'package.name', name:'package.name', orderable: false},
                // {data: 'actual_weight', name:'actual_weight', orderable: false},
                // {data: 'package_quantity', name:'package_quantity', orderable: false},
                // {data: 'guide.warehouse.company.name', name:'guide.warehouse.company.name', orderable: false, searchable: false},  // 8

                // {data: 'gc_code', name:'gc_code', orderable: false, searchable:false}, // 9
                // {data: 'date_arrival', name:'date_arrival', orderable: false, searchable:false}, // 10
                // {data: 'date_retirement', name:'date_retirement', orderable: false, searchable:false}, //11
                // {data: 'departure.code_green_care', name:'departure.code_green_care', orderable: false, searchable:false}, // 12

                // {data: 'departure.destination', name:'departure.destination', orderable: false},
                // {data: 'departure.plate', name:'departure.plate', orderable: false},
                // {data: 'departure.weigth', name:'departure.weigth', orderable: false},
                // {data: 'departure.weigth_diff', name:'departure.weigth_diff', orderable: false},
                // {data: 'departure.date_departure', name:'departure.date_departure'},

                // {data: 'disposition.code_dff', name:'disposition.code_dff', orderable: false, searchable:false}, // 18
                // {data: 'disposition.weigth', name:'disposition.weigth', orderable: false, searchable:false}, // 19
                // {data: 'disposition.weigth_diff', name:'disposition.weigth_diff', orderable: false, searchable:false}, // 20
                // {data: 'disposition.disposition_place', name:'disposition.disposition_place', orderable: false, searchable:false}, // 21
                // {data: 'disposition.code_invoice', name:'disposition.code_invoice', orderable: false, searchable:false}, // 22
                // {data: 'disposition.code_certification', name:'disposition.code_certification', orderable: false, searchable:false}, // 23
                // {data: 'disposition.plate', name:'disposition.plate', orderable: false, searchable:false}, // 24
                // {data: 'disposition.managment_report', name:'disposition.managment_report', orderable: false, searchable:false}, // 25
                // {data: 'disposition.observations', name:'disposition.observations', orderable: false, searchable:false}, // 26
                // {data: 'disposition.date_arrival', name:'disposition.date_arrival', orderable: false, searchable:false}, // 27
                // {data: 'disposition.date_dff', name:'disposition.date_dff', orderable: false, searchable:false}, // 28

                { data: 'status', name: 'status' }, // * 19
            ],
            columnDefs: [
                // { 'visible': false, 'targets': [9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
            ],
            dom: 'Bfrtlip',
            buttons: [
                {
                    text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(.not-export-col)'
                    },
                    title: function () {
                        var from_date = $('#daterange-btn-dispositions-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-dispositions-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-departures-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'El principio'; end_date = 'El final' };
                        return 'DETALLE DISPOSICIÓN - GESTOR: ' + name + ' - DESDE: ' + from_date + ' - ' + 'HASTA: ' + end_date;
                    },
                    filename: function () {
                        var from_date = $('#daterange-btn-dispositions-manager').data('daterangepicker').startDate.format('YYYY-MM-DD');
                        var end_date = $('#daterange-btn-dispositions-manager').data('daterangepicker').endDate.format('YYYY-MM-DD');
                        var name = $('#excel-generated-departures-info').data('name');
                        if (from_date == '1970-01-01') { from_date = 'todos'; end_date = 'todos' };
                        return 'detalle-disposición_gestor-' + name + '_' + from_date + '_' + end_date + '_' + moment().format("hh-mm-ss");
                    }
                }
            ],
            initComplete: function () {
                $.fn.dataTable.ext.search.push(
                    function (settings, data, dataIndex) {

                        if (settings.nTable.id !== 'dispositions-table-manager') {
                            return true;
                        }

                        var min = moment($('#daterange-btn-dispositions-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')).toDate();
                        var max = moment($('#daterange-btn-dispositions-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')).toDate();
                        var startDate = moment(data[8]).toDate();
                        if (min == null && max == null) { return true; }
                        if (min == null && startDate <= max) { return true; }
                        if (max == null && startDate >= min) { return true; }
                        if (startDate <= max && startDate >= min) { return true; }
                        return false;
                    }
                );
            }
        })

        dispositionManagerTable.on('draw.dt', function () {
            var btn_container = $('#btn-register-disposition-container')

            btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                        <i class="fa-solid fa-square-plus"></i> &nbsp; <span class="me-1"> Disposición </span>\
                                </div>');

            $('input[name="dispositions-selected[]"]:checked').each(function () {
                $(this).prop('checked', false)
            })

            let weightCountDisposition = $('#total_weight_count_disposition')
            let url = weightCountDisposition.data('url')

            var startDate = $('#daterange-btn-dispositions-manager').data('daterangepicker').startDate.format('YYYY-MM-DD')
            var endDate = $('#daterange-btn-dispositions-manager').data('daterangepicker').endDate.format('YYYY-MM-DD')
            var equalValues = startDate == endDate

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    table: "disposition",
                    from_date: equalValues ? null : startDate,
                    end_date: equalValues ? null : endDate,
                    status: $('input[name=filter-departures-stat-disposition]:checked').val(),
                    guide_gc: $('select[name=guide_gc_select]').val(),
                    destination: $('select[name=destination_select]').val(),
                    plate: $('select[name=plate_select]').val(),
                    waste: $('select[name=waste_name_select]').val()
                },
                success: function (data) {
                    weightCountDisposition.val(data.value)
                },
                error: function (data) {
                    console.log(data)
                }
            })
        });

        // * ------------ REGISTER DISPOSITION ------------ */

        $('html').on('click', '#btn-register-disposition-modal', function () {

            var button = $(this);
            var modal = $('#RegisterDispositionModal');
            var spinner = button.find('.loadSpinner');
            var values = [];
            var url = $('#btn-register-disposition-container').data('url');
            var tbody = $('#t-body-disposition-wastes-manager')

            spinner.toggleClass('active');
            tbody.html('');

            $('input[name="dispositions-selected[]"]:checked').each(function () {
                values.push($(this).val())
            });

            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    "values": values
                },
                dataType: 'JSON',
                success: function (data) {

                    /* ----------------------------------------------------*/

                    $.each(data['dispositions'], function (key, values) {

                        tbody.append('<tr> \
                                        <input name="disposition-ids[]" type="hidden" value="'+ values.id + '"> \
                                        <td>'+ values.code_green_care + '</td> \
                                        <td>'+ values.destination + '</td> \
                                        <td>'+ values.plate_init + '</td> \
                                        <td>'+ values.weigth_init + '</td> \
                                        <td>'+ values.date_departure + '</td> \
                                    </tr>');
                    })

                    var inputTotalWeight = $('#total-weight-disposition-manager')
                    inputTotalWeight.text(data['total_weight'])

                    modal.modal('show')
                },
                complete: function (data) {
                    spinner.toggleClass('active')
                },
                error: function (data) {
                    console.log(data)
                }
            });

        })

        $('#register-disposition-form').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            var spinner = form.find('.loadSpinner')
            var url = form.attr('action');
            var modal = $('#RegisterDispositionModal')
            var btn_container = $('#btn-register-disposition-container');

            Swal.fire({
                title: 'Confirmar',
                text: '¡Esta acción no se podrá deshacer!',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {

                    spinner.toggleClass('active');

                    $.ajax({
                        method: form.attr('method'),
                        url: url,
                        data: form.serialize(),
                        dataType: 'JSON',
                        success: function (data) {
                            Swal.fire({
                                toast: true,
                                icon: 'success',
                                text: '¡Registrado exitosamente!',
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });

                            btn_container.html('<div class="btn btn-secondary" style="pointer-events: none;"> \
                                                <i class="fa-solid fa-square-plus"></i> &nbsp; Disposición \
                                            </div>');

                            dispositionManagerTable.ajax.reload(null, false)
                            modal.modal('hide')

                            modal.find('input[name=n-ddff-guide]').val('')
                            modal.find('input[name=ddff-weight]').val('')
                            modal.find('input[name=weight-diff]').val('')
                            modal.find('select[name=disposition-place]').val('').change()
                            modal.find('input[name=n-invoice]').val('')
                            modal.find('input[name=n-certification]').val('')
                            modal.find('input[name=plate]').val('')
                            modal.find('input[name=report]').val('')
                            modal.find('input[name=observation]').val('')

                        },
                        complete: function (data) {
                            spinner.toggleClass('active')
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                }
            }, function (dismiss) {
                return false;
            })


        })

        $('html').on('click', '.btn-show-disposition', function (e) {
            e.preventDefault()

            var url = $(this).data('url')
            var modal = $('#showDispositionDetailModal')
            var content = modal.find('#disposition_detail_content')

            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'JSON',
                success: function (data) {

                    content.html(data.html)
                    modal.modal('show')
                },
                error: function (data) {
                    console.log(data)
                }
            })
        })

    }





    $('input:checkbox.check_options').on('click', function (e) {

        let checkbox = $(this)
        let is_checked = checkbox.prop('checked')

        let options = checkbox.closest('.form-group').find('.options_items input:checkbox.selectgroup-input')

        options.each(function () {
            if (is_checked) {
                $(this).prop('checked', true)
            } else {
                $(this).prop('checked', false)
            }
        })

    })

});

