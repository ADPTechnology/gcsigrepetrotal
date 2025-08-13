<div class="modal fade" id="editGuideWasteModal" tabindex="-1" aria-labelledby="editGuideWasteModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="editGuideWasteModalLabel">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-pen-to-square"></i> &nbsp;
                        Editar Internamiento
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <form action="" id="editGuideWasteForm" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group col-md-12">
                            <label>N° Guía de Internamiento</label>
                            <div id="code_guide_waste" class="disabled-txt-input">
                            </div>
                        </div>
                    </div>

                    {{-- <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="date_appoved_input">Fecha de aprobación ADC *</label>
                            <div class="input-group">
                                <input id="date_appoved_input" type="datetime-local" name="date_approved" class="form-control" required>
                            </div>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="date_verified_input">Fecha de verificación *</label>
                            <div class="input-group">
                                <input id="date_verified_input"  type="datetime-local" name="date_verified" class="form-control" required>
                            </div>
                        </div>

                    </div> --}}

                    <div class="form-row">
                        <div class="form-group col-12">
                            <label>Clase *</label>
                            <select data-url="{{ route('guides.getDataWarehouse') }}" name="class_symbol" class="form-control select2" id="editClassSymbolSelect" required>
                                <option></option>
                            </select>
                        </div>

                        <div class="form-group col-12">
                            <label>Residuo *</label>
                            <select name="waste_type" class="form-control select2" id="editWasteTypeSelect" required>
                                <option></option>
                            </select>
                        </div>

                        <div class="form-group col-12">
                            <label>Gestión *</label>
                            <select name="gestion_type" class="form-control select2" id="editGestionTypeSelect" required>
                                <option></option>
                            </select>
                        </div>
                    </div>


                    <div class="form-row" id="selects-container-edit">

                        <div class="form-group col-md-6">
                            <label>Peso (Kg) *</label>
                            <div class="input-group">
                                <input type="number" name="aprox_weight" class="form-control" required step="0.01">
                            </div>
                        </div>

                        {{-- <div class="form-group col-md-6">
                            <label for="inputProfile">N° de Bultos *</label>
                            <div class="input-group">
                                <input type="number" name="package_quantity" class="form-control" required step="1">
                            </div>
                        </div> --}}

                        {{-- <div class="form-group col-12">
                            <label for="inputProfile">Volumen de la carga (opcional)</label>
                            <div class="input-group">
                                <input type="number" name="volum" class="form-control" step="0.01">
                            </div>

                        </div> --}}
                    </div>





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
