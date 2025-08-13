<div class="modal fade" id="edit_updateDeparturePgModal" tabindex="-1" aria-labelledby="updateDeparturePgModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-wastes">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-truck-moving"></i> &nbsp;
                        <span id="txt-context-element">
                            Editar carga
                        </span>
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"> &times; </span>
                </button>
            </div>

            <form action="" id="edit-updateDeparture-pg-manager-form"
                method="POST">
                @csrf

                <div class="modal-body" id="edit_pg_form_container">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary btn-save">
                        Guardar
                        <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                    </button>
                </div>

            </form>

        </div>



    </div>
</div>
