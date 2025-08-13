<table>
    <thead>
        <tr>
            <th>Nro. Guía de Embalaje</th>
            <th>Nro. Guía de Internamiento</th>
            <th>Clase</th>
            <th>Nombre de residuo</th>
            <th>Tipo de embalaje</th>
            <th>Peso Real (Kg)</th>
            <th>Nro. Bultos</th>
            <th>Empresa</th>
            <th>Fecha de salida del residuo</th>
            <th>Fecha de salida Malvinas</th>
            <th>Volumen de la Carga (m3)</th>
            <th>Manejo/gestión</th>
            <th>Salida</th>
            <th>Registrado el</th>
        </tr>
    </thead>

    <tbody>
        @foreach ($wastes as $waste)
            <tr>
                <td>{{ $waste->packingGuide->cod_guide }}</td>
                <td>{{ $waste->guide->code }}</td>
                <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
                <td>{{ $waste->waste->name }}</td>
                <td>{{ $waste->package->name ?? '-' }}</td>
                <td>{{ $waste->actual_weight }}</td>
                <td>{{ $waste->package_quantity }}</td>
                <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
                <td>{{ $waste->packingGuide->date_guides_departure ?? '-' }}</td>
                <td>{{ $waste->date_departure ?? '-' }}</td>
                <td>{{ $waste->packingGuide->volum ?? '-' }}</td>
                <td>{{ $waste->stat_stock == 1 ? 'Gestionado' : 'Pendiente' }}</td>
                <td>{{ $waste->stat_departure == 1 ? 'Gestionado' : 'Pendiente' }}</td>
                <td>{{ $waste->created_at }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
