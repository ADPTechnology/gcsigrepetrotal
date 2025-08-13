<table class="table table-hover">
    <thead>
        <tr>
            <th>N° Guía PPC</th>
            <th>N° de Manifiesto</th>
            <th>Peso total (Kg)</th>
            <th>N° Bultos total</th>
            <th>Volumen Total (m3)</th>
            <th>Tipo de transporte</th>
            <th>Destino</th>
            <th>Fecha de salida Malvinas</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>{{ $departure->ppc_code }}</td>
            <td>{{ $departure->manifest_code }}</td>
            <td>{{ $departure->wastes_sum_actual_weight }}</td>
            <td>{{ $departure->wastes_sum_package_quantity }}</td>
            <td>{{ $departure->packing_guides_sum_volum }}</td>
            <td>{{ $departure->shipping_type }}</td>
            <td>{{ $departure->destination }}</td>
            <td>{{ $departure->date_departure }}</td>
        </tr>
    </tbody>

</table>

<div class="text-bold p-2 mb-2 subtitle">
    Guías de Carga:
</div>

<table class="table table-sm table-hover">
    <thead>
        <tr>
            <th>Registro de Salida de residuos</th>
            <th>Peso Total (Kg)</th>
            <th>Total bultos</th>
            <th>Volumen (m3)</th>
            <th>Fecha de salida de los residuos</th>
        </tr>
    </thead>

    <tbody>
        @foreach ($departure->packingGuides as $packingGuide)
        <tr>
            <td>{{ $packingGuide->cod_guide }}</td>
            <td>{{ $packingGuide->wastes_sum_actual_weight }}</td>
            <td>{{ $packingGuide->wastes_sum_package_quantity }}</td>
            <td>{{ $packingGuide->volum }}</td>
            <td>{{ $packingGuide->date_guides_departure }}</td>
        </tr>
        @endforeach

    </tbody>

</table>
