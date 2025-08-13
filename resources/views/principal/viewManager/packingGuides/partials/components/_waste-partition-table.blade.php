<div style="overflow: auto">
    <table id="waste-partition-stock-manager-table" class="table table-hover">
        <thead>
            <tr>
                <th>Nro. Guía de Internamiento</th>
                <th>clase</th>
                <th>Nom. Residuo</th>
                <th>Tipo de embalaje</th>
                <th>Peso Real (Kg)</th>
                <th>Nro. Bultos</th>
                <th>Empresa</th>
                <th>Fecha de Guía</th>
            </tr>
        </thead>

        <tbody id="t-body-wastes-partition-stock-manager">
            <tr>
                <td>{{ $waste->guide->code }}</td>
                <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
                <td>{{ $waste->waste->name }}</td>
                <td>{{ $waste->package->name }}</td>
                <td>{{ $waste->actual_weight }}</td>
                <td>{{ $waste->package_quantity }}</td>
                <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
                <td>{{ $waste->guide->created_at }}</td>
            </tr>
        </tbody>

    </table>
</div>


<div class="form-row">
    <div class="form-group col-md-6">
        <label> Peso Total (Kg): </label>
        <div class="disabled-txt-input" id="total-weight-waste-partition">
            {{ $waste->actual_weight }}
        </div>
    </div>
    <div class="form-group col-md-6">
        <label>Cantidad de Bultos: </label>
        <div class="disabled-txt-input">
            {{ $waste->package_quantity }}
        </div>
    </div>
</div>
