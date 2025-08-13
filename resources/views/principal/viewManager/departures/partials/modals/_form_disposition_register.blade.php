<div class="modal fade" id="RegisterDepartureModal" tabindex="-1" aria-labelledby="RegisterDepartureModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-wastes">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="RegisterDepartureModalTitle">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-truck"></i> &nbsp;
                        <span id="txt-context-element">
                            Dar salida
                        </span>
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"> &times; </span>
                </button>
            </div>

            <form action="{{route('managerWastesDeparture.update')}}" id="register-departure-form" method="POST">
                @csrf

                <div class="modal-body">

                    <div class="text-bold p-2 mb-2 subtitle">
                        Residuos de las cargas seleccionadas:
                    </div>

                    <div style="overflow: auto;">
                        <table id="wastes-selected-departure-manager-table" class="table table-hover">

                        </table>
                    </div>


                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label>Fecha salida de Pucallpa *</label>
                            <div class="input-group">
                                <input type="text" name="date-departure" class="form-control datetimepicker" required>
                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group col-md-4">
                            <label>Destino *</label>
                            <input type="text" name="destination" class="form-control"
                                placeholder="Ingresar destino" required>
                        </div>

                        <div class="form-group col-md-4">
                            <label>Placa camión Pucallpa *</label>
                            <input type="text" name="plate" class="form-control"
                                placeholder="Ingresar placa" required>
                        </div>

                    </div>

                    <div class="form-row">

                        <div class="form-group col-md-6">
                            <label for="inputVolume">N° Guía Green Care *</label>
                            <input type="text" name="n-green-care-guide" class="form-control"
                                placeholder="Ingresar número de guía" required>
                        </div>

                        <div class="form-group col-md-6">
                            <label for="inputVolume">Peso Salida Pucallpa (Kg)*</label>
                            <input type="number" name="retrieved-weight" class="form-control" min="0" step="0.01"
                                placeholder="Ingresar peso salida pucallpa" required>
                        </div>

                        {{-- <div class="form-group col-md-4">
                            <label for="inputVolume">Dif. de peso Malvinas-Pucallpa *</label>
                            <input type="number" name="weight-diff" class="form-control" min="0" step="0.01"
                                placeholder="Ingresar diferencia de pesos" required>
                        </div> --}}

                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary btn-save disabled">
                        Guardar
                        <i class="fa-solid fa-spinner fa-spin loadSpinner ms-1"></i>
                    </button>
                </div>


            </form>

        </div>



    </div>
</div>
