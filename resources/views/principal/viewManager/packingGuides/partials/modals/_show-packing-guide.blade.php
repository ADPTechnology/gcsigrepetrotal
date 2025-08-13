<div class="modal fade" id="showPackingGuideDetailModal" tabindex="-1" aria-labelledby="showPackingGuideDetailModal"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-wastes">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="showPackingGuideDetailModalTitle">
                    <div class="section-title mt-0">
                        <i class="fa-solid fa-layer-group"></i> &nbsp;
                        <span id="txt-context-element">
                            Detalle de Carga
                        </span>
                    </div>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"> &times; </span>
                </button>
            </div>

            <div class="modal-body">

                <div style="overflow: auto;">
                    <table id="show-packing-guide-manager-table" class="table table-hover">
                        <thead>
                            <tr>
                                <th>Registro de salida de los residuos</th>
                                <th>Peso total (Kg)</th>
                                <th>Total bultos</th>
                                <th>Volumen (m3)</th>
                                <th>Fecha de salida de los residuos</th>
                                <th>Estado salida</th>
                                <th>Estado llegada</th>
                            </tr>
                        </thead>

                        <tbody id="t-body-show-packing-guide-manager">

                        </tbody>

                    </table>
                </div>

                <div class="text-bold p-2 mb-2 subtitle">
                    Residuos de la carga:
                </div>

                <div style="overflow: auto;">
                    <table id="intGuide-show-manager-table" class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nro. Guía de Internamiento</th>
                                <th>Clase</th>
                                <th>Nom. Residuo</th>
                                <th>Tipo de embalaje</th>
                                <th>Peso Real (Kg)</th>
                                <th>Nro. Bultos</th>
                                <th>Empresa</th>
                                <th>Fecha de verificación</th>
                                <th>Manejo/Gestión</th>
                                <th>Estado Salida</th>
                                <th>Estado Llegada</th>
                                <th>Estado Salida de Pucallpa</th>
                                <th>Estado Disposición</th>
                            </tr>
                        </thead>

                        <tbody id="t-body-int-guides-manager">
                        </tbody>

                    </table>
                </div>

            </div>
        </div>

    </div>
</div>
