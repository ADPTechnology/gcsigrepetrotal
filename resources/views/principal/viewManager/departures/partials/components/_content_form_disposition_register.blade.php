<thead>
    <tr>
        <th>Elegir</th>
        <th>Estado salida de Pucallpa</th>
        <th>Registro de salida de Residuos</th>
        <th>N° Guía de Internamiento</th>
        <th>Clase</th>
        <th>Nom. Residuo</th>
        <th>Tipo de embalaje</th>
        <th>Peso Real (Kg)</th>
        <th>Nro. Bultos</th>
        <th>Empresa</th>
        <th>Fecha de Guía</th>
    </tr>
</thead>

<tbody id="t-body-departure-wastes-manager">
    @foreach ($packingGuides as $packingGuide)

        @foreach ($packingGuide->wastes as $waste)
        <tr>
            <td>
                @if ($waste->stat_transport_departure == 1)
                <div class="custom-checkbox custom-control">
                    <input type="checkbox" style="pointer-events: none;"
                    data-status-disposition="{{ $waste->stat_transport_departure }}"
                    class="custom-control-input disabled wastes">
                    <label class="custom-control-label checkbox-wastes-disposition" style="pointer-events: none;">&nbsp;</label>
                </div>
                @else
                    <div class="custom-checkbox custom-control">
                        <input type="checkbox" name="wastes-disposition-selected[]"
                        data-status-disposition="{{ $waste->stat_transport_departure }}"
                        class="custom-control-input wastes" id="w-disp-checkbox-{{ $waste->id }}" value="{{ $waste->id }}">
                        <label for="w-disp-checkbox-{{ $waste->id }}"
                            class="custom-control-label checkbox-wastes-disposition">&nbsp;</label>
                    </div>
                @endif

            </td>
            <td>
                @if ($waste->stat_transport_departure == 1)
                    <span class="badge badge-pill badge-success">
                        Gestionado
                    </span>
                @else
                    <span class="badge badge-pill badge-warning">
                        Pendiente
                    </span>
                @endif
            </td>
            <td>{{ $packingGuide->cod_guide }}</td>
            <td>{{ $waste->guide->code }}</td>
            <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
            <td>{{ $waste->waste->name }}</td>
            <td>{{ $waste->package->name }}</td>
            <td>{{ $waste->actual_weight }}</td>
            <td>{{ $waste->package_quantity }}</td>
            <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
            <td>{{ $waste->guide->created_at }}</td>
        </tr>
        @endforeach


    @endforeach


</tbody>
