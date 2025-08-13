<div class="text-bold p-2 mb-2 subtitle">
    Guía Seleccionada:
</div>

<div style="overflow: auto;">
    <table id="guides-departure-manager-table" class="table table-hover">
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

        <tbody id="edit-t-body-guides-departure-manager">
            @include('principal.viewManager.packingGuides.partials.components._pg-update-table')
        </tbody>

    </table>
</div>


<div class="form-row">
    <div class="form-group col-md-4">
        <label for="transport-type-select">Tipo de transporte</label>
        <input type="text" readonly class="form-control disabled no-pointer-events"
        value="{{ $guide->shipping_type }}">
    </div>
    <div class="form-group col-md-4">
        <label>Fecha de salida Malvinas</label>
        <input type="text" readonly class="form-control disabled no-pointer-events"
        value="{{ $guide->date_departure }}">
    </div>
    <div class="form-group col-md-4">
        <label for="destination-select">Destino de la carga</label>
        <input type="text" readonly class="form-control disabled no-pointer-events"
        value="{{ $guide->destination }}">
    </div>
</div>

<div class="form-row">

    <div class="form-group col-md-6">
        <label for="transport-type-select">N° de Guía PPC</label>
        <input type="text" readonly class="form-control disabled no-pointer-events"
        value="{{ $guide->ppc_code }}">
    </div>
    <div class="form-group col-md-6">
        <label>N° de Manifiesto *</label>
        <input type="text" name="manifest_code" class="form-control" maxlength="10000" required
        value="{{ $guide->manifest_code }}">
    </div>
</div>
