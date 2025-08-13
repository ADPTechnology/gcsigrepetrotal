<div class="modal fade" id="RegisterStockPartitionModal" tabindex="-1" aria-labelledby="RegisterStockPartitionModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="RegisterStockPartitionModalTitle">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-boxes-stacked"></i> &nbsp;
                        <span id="txt-context-element">
                            Particionar Residuo
                        </span>
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"> &times; </span>
                </button>
            </div>

            <form action="" id="store-partitions-stock-form" method="POST">
                @csrf

                <div class="modal-body">

                    <div class="text-bold p-2 mb-2 subtitle">
                        Residuo seleccionado:
                    </div>

                    <div class="table-stock-partition-container">
                        {{-- * ---- AQUI VA LA INFO DEL RESIDUO --------- --}}
                    </div>

                    <hr>

                    <div class="form-row">
                        <div class="form-group col-12" style="margin-bottom: 0 !important;">
                            <label>Número de particiones: </label>
                        </div>
                        <div class="form-group col-lg-4 col-md-5 col-10">
                            <input type="number" class="form-control" name="partitions_number"
                                step="1" min="1" required>
                        </div>

                        <div class="form-group col-lg-1 col-2">
                            <span class="form-control btn btn-primary
                            btn-add-partitions
                            btn-valid-load-partitions">
                                <i class="fa-solid fa-check"></i>
                            </span>
                        </div>
                    </div>


                    <div class="stock-partitions-container">

                        <div class="form-row row-general-partition">
                            <div class="form-group col-lg-5 col-md-7 col-10 row-group-partition">
                                <div class="text-nowrap font-weight-bold">
                                    Partición
                                    <span class="index-row-partition">
                                        1
                                    </span>
                                    :
                                </div>
                                <input type="number" class="form-control text-right no-arrows" name="partitions_qtty[]" min="0" step='0.1' required>
                                <div class="font-weight-bold">
                                    Kg.
                                </div>
                            </div>

                            <div class="form-group col-lg-1 col-2">
                                <span class="form-control btn btn-danger btn-remove-partition">
                                    <i class="fa-solid fa-trash-can"></i>
                                </span>
                            </div>
                        </div>

                    </div>

                    <div class="sale-stock-partitions-container mt-3">
                    </div>

                    <div class="alert-stock-partitions-container col-lg-5 col-md-7 col-10">
                        <span class="badge badge-pill badge-warning">
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>
                            La cantidad ingresada superó el peso total del residuo.
                        </span>
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
