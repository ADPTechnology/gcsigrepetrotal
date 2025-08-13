import { dateRangeConfig } from "./utils.js";
import DataTableEs from "./datatable_es.js";

$(() => {

    if ($('#inter_management-table').length) {

        var interManagementTableEle = $('#inter_management-table');
        var getInterManagementUrl = interManagementTableEle.data('url');
        var interManagementTable = interManagementTableEle.DataTable({
            responsive: true,
            language: DataTableEs,
            ajax: {
                "url": getInterManagementUrl,
                "data": {
                    "table": "inter_management"
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
                    title: 'Gestión_interna_' + moment().format("YY-MM-DD_hh-mm-ss"),
                    filename: 'gestión_interna' + moment().format("YY-MM-DD_hh-mm-ss"),
                }
            ],
        })

        /* ----------- REGISTER ------------*/

        $('#registerInterManagementForm').on('submit', function (e) {
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
                    $('#registerInterManagementForm').trigger('reset');

                    interManagementTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })

        })

        /* -------------- EDIT ------------ */

        $('#inter_management-table').on('click', '.editInterManagment', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-int-management-edit-container').remove();
            column.siblings().find('.input-int-management-edit').remove();

            buttons.before('<td class="input-int-management-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-int-management-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-int-management\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetIntManagementEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#inter_management-table').on('click', '#resetIntManagementEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-int-management-edit').remove();
            $('#form-int-management-edit-container').remove();
        })

        $('#inter_management-table').on('click', '.btn-update-int-management', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-int-management-edit input').val();
            var url = column.find('.editInterManagment').data('url');

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
                        "name": value
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

                        interManagementTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#inter_management-table').on('click', '.deleteInterManagment', function () {
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
                                interManagementTable.ajax.reload(null, false);
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




        // * ------------- GESTIÓN EXTERNA ------------------

        var extManagementTable;

        $('#ext_management_tab').on('click', function () {

            if (!($('#ext_management_table_wrapper').length)) {
                var extManagementTableEle = $('#ext_management_table');
                var getExtManagementUrl = extManagementTableEle.data('url');
                extManagementTable = extManagementTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getExtManagementUrl,
                        "data": {
                            "table": "ext_management"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name',  className: "columnType"  },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'btnWasteType not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)',
                            },
                            title: 'Gestión_externa_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'gestión_externa' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        /* ----------- REGISTER ------------*/

        $('#registerExtManagementForm').on('submit', function (e) {
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
                    $('#registerExtManagementForm').trigger('reset');

                    extManagementTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })
        })

        /* -------------- EDIT ------------ */

        $('#ext_management_table').on('click', '.editExtManagment', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-ext-management-edit-container').remove();
            column.siblings().find('.input-ext-management-edit').remove();

            buttons.before('<td class="input-ext-management-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-ext-management-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-ext-management\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetExtManagementEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#ext_management_table').on('click', '#resetExtManagementEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-ext-management-edit').remove();
            $('#form-ext-management-edit-container').remove();
        })

        $('#ext_management_table').on('click', '.btn-update-ext-management', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-ext-management-edit input').val();
            var url = column.find('.editExtManagment').data('url');

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
                        "name": value
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

                        extManagementTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#ext_management_table').on('click', '.deleteExtManagment', function () {
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
                                extManagementTable.ajax.reload(null, false);
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




        // * ------------- DISPOSICIÓN FINAL EXTERNA ------------------

        var finalDispTable;

        $('#ext_disposition_tab').on('click', function () {

            if (!($('#final_disp_table_wrapper').length)) {
                var finalDispTableEle = $('#final_disp_table');
                var getFinalDispUrl = finalDispTableEle.data('url');
                finalDispTable = finalDispTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getFinalDispUrl,
                        "data": {
                            "table": "ext_disposition"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name',  className: "columnType"  },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'btnWasteType not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)',
                            },
                            title: 'Disposición_final_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'disposición_final_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        /* ----------- REGISTER ------------*/

        $('#registerDispFinalExtForm').on('submit', function (e) {
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
                    $('#registerDispFinalExtForm').trigger('reset');

                    finalDispTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })
        })

        /* -------------- EDIT ------------ */

        $('#final_disp_table').on('click', '.editExtDisposition', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-final-dips-edit-container').remove();
            column.siblings().find('.input-final-dips-edit').remove();

            buttons.before('<td class="input-final-dips-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-final-dips-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-final-dips\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetFinalDispEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#final_disp_table').on('click', '#resetFinalDispEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-final-dips-edit').remove();
            $('#form-final-dips-edit-container').remove();
        })

        $('#final_disp_table').on('click', '.btn-update-final-dips', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-final-dips-edit input').val();
            var url = column.find('.editExtDisposition').data('url');

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
                        "name": value
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

                        finalDispTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#final_disp_table').on('click', '.deleteExtDisposition', function () {
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
                                finalDispTable.ajax.reload(null, false);
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


        // * ------------- LUGAR DE DISPOSICIÓN------------------

        var dispPlaceTable;

        $('#disposition_place_tab').on('click', function () {

            if (!($('#disp_place_table_wrapper').length)) {
                var DispPlaceTableEle = $('#disp_place_table');
                var getDispPlacepUrl = DispPlaceTableEle.data('url');
                dispPlaceTable = DispPlaceTableEle.DataTable({
                    language: DataTableEs,
                    // serverSide: true,
                    // processing: true,
                    ajax: {
                        "url": getDispPlacepUrl,
                        "data": {
                            "table": "disposition_place"
                        }
                    },
                    columns: [
                        { data: 'id', name: 'id' },
                        { data: 'name', name: 'name',  className: "columnType"  },
                        { data: 'action', name: 'action', orderable: false, searchable: false, className: 'btnWasteType not-export-col' },
                    ],
                    dom: 'Bfrtlip',
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-download"></i> &nbsp; Descargar Excel',
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':not(.not-export-col)',
                            },
                            title: 'Lugar_disposición_' + moment().format("YY-MM-DD_hh-mm-ss"),
                            filename: 'lugar_disposición_' + moment().format("YY-MM-DD_hh-mm-ss"),
                        }
                    ],
                });
            }
        })

        /* ----------- REGISTER ------------*/

        $('#registerDispPlaceExtForm').on('submit', function (e) {
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
                    $('#registerDispPlaceExtForm').trigger('reset');

                    dispPlaceTable.ajax.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })
        })

        /* -------------- EDIT ------------ */

        $('#disp_place_table').on('click', '.editDisPlace', function () {
            var column = $(this).closest('tr');
            var buttons = column.find('.btnWasteType');
            var tdText = column.find('.columnType');
            var value = tdText.text();

            column.addClass('edit-ready').siblings().removeClass('edit-ready');
            column.siblings().find('#form-disp-place-edit-container').remove();
            column.siblings().find('.input-disp-place-edit').remove();

            buttons.before('<td class="input-disp-place-edit"> \
                        <input type="text" class="form-control" value="'+ value + '" required> \
                    </td>');

            column.append('<td id="form-disp-place-edit-container"> \
                        <button type="button"\
                                class="me-3 edit btn btn-primary btn-sm btn-update-disp-place\
                                "> \
                                <i class="fa-solid fa-floppy-disk"></i> \
                        </button> \
                        <button id="resetDispPlaceEdit"\
                                class="ms-3 btn btn-danger btn-sm"> \
                                <i class="fa-solid fa-x"></i> \
                        </button> \
                    </td>');
        })

        $('#disp_place_table').on('click', '#resetDispPlaceEdit', function () {
            var column = $(this).closest('tr');
            column.toggleClass('edit-ready');

            column.find('.input-disp-place-edit').remove();
            $('#form-disp-place-edit-container').remove();
        })

        $('#disp_place_table').on('click', '.btn-update-disp-place', function () {
            var column = $(this).closest('tr');
            var value = column.find('.input-disp-place-edit input').val();
            var url = column.find('.editDisPlace').data('url');

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
                        "name": value
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

                        dispPlaceTable.ajax.reload(null, false);
                    },
                    error: function (result) {
                        console.log(result)
                    }
                });
            }
        });

        /*-------------- DELETE --------------*/

        $('#disp_place_table').on('click', '.deleteDisPlace', function () {
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
                                dispPlaceTable.ajax.reload(null, false);
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
    }

})
