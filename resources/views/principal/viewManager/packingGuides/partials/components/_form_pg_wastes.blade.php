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

@if ($gestionType == 'EXTERNA')
    <hr>

    <div class="form-row">

        <div class="form-group col-md-4">
            <label>Fecha de Zarpe</label>
            <div class="datepicker-range-container input-daterange input-group" id="datepicker_sailing_date">
                <input type="text" name="sailing_date" class="form-control" style="max-width: 100%;" placeholder="Selecciona una fecha">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <i class="fa-solid fa-calendar-days"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group col-md-4">
            <label for="">Barcaza</label>
            <input type="text" name="barge" class="form-control" value="{{ $guide->barge }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Bultos</label>
            <input type="number" name="packages" class="form-control" value="{{ $guide->packages }}">
        </div>

    </div>

    <div class="form-row">

        <div class="form-group col-md-4">
            <label for="">Tipo de Embalaje</label>
            <input type="text" name="packaging_type" class="form-control" value="{{ $guide->packaging_type }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Peso Kg (Transber) (Grúa)</label>
            <input type="text" name="crane_weight_kg" class="form-control" value="{{ $guide->crane_weight_kg }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Guia Green Care del Perú - Transportista</label>
            <input type="text" name="carrier_guide" class="form-control" value="{{ $guide->carrier_guide }}">
        </div>

    </div>

    <div class="form-row">
        <div class="form-group col-md-4">
            <label for="">Placa</label>
            <input type="text" name="plate_number" class="form-control" value="{{ $guide->plate_number }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Guia Green Care del Perú</label>
            <input type="text" name="greencare_guide" class="form-control" value="{{ $guide->greencare_guide }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Fecha de Disposición</label>
            <div class="datepicker-range-container input-daterange input-group" id="datepicker_disposal_date">
                <input type="text" name="disposal_date" class="form-control" style="max-width: 100%;" placeholder="Selecciona una fecha">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <i class="fa-solid fa-calendar-days"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="form-row">

        <div class="form-group col-md-4">
            <label for="">Comprobante Pesaje</label>
            <input type="text" name="weighing_receipt" class="form-control" value="{{ $guide->weighing_receipt }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Peso (Kg) DD.FF</label>
            <input type="number" name="ddff_weight_kg" class="form-control" value="{{ $guide->ddff_weight_kg }}">
        </div>

        <div class="form-group col-md-4">
            <label for="">Empresa: Disposición Final</label>
            <input type="text" name="disposal_company" class="form-control" value="{{ $guide->disposal_company }}">
        </div>

    </div>

    <hr>
@endif


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

@if ($gestionType == 'EXTERNA')
<div class="form-row">

    <div class="form-group col-md-6">
        <label for="transport-type-select">N° de Guía PPC</label>
        <input type="text" readonly class="form-control disabled no-pointer-events" value="{{ $guide->ppc_code }}">
    </div>
    <div class="form-group col-md-6">
        <label>N° de Manifiesto *</label>
        <input type="text" name="manifest_code" class="form-control" maxlength="10000"
            value="{{ $guide->manifest_code }}">
    </div>
</div>
    
@endif

<hr>

<div class="form-row">

    <div class="form-group col-12">
        <label> Comentario:</label>
        <input type="text" name="comment" class="form-control" value="{{ $guide->comment }}">
    </div>

</div>


