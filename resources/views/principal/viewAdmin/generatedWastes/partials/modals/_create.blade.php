<div class="modal fade" id="createIntermentGuideModal" tabindex="-1" aria-labelledby="createIntermentGuideModal">
    <div class="modal-dialog modal-xl modal-overflow modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="createIntermentGuideModalLabel">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-square-plus"></i>&nbsp;
                        Agregar Internamiento
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <form action="{{ route('guides.store') }}" method="POST" id="registerGuideForm">
                @csrf
                <div class="modal-body" id="content-register-intguide">
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Cerrar</button>
                    <button type="submit" id="button-save-guide" class="btn btn-primary btn-save">
                        <i class="fa-solid fa-floppy-disk"></i> &nbsp;
                        Guardar
                        <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

</div>
