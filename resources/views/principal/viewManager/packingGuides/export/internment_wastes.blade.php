<table>
    <thead>
        <tr>
            <th>Nro. Guía de Internamiento</th>
            <th>clase</th>
            <th>Nom. Residuo</th>
            <th>Tipo de embalaje</th>
            <th>Peso Real (Kg)</th>
            <th>Nro. Bultos</th>
            <th>Empresa</th>
            <th>Fecha de verificación</th>
            <th>Manejo/gestión</th>
            <th>Estado Salida</th>
        </tr>
    </thead>

    <tbody>
        @foreach ($wastes as $waste)
            <tr>
                <td>{{ $waste->guide->code }}</td>
                <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
                <td>{{ $waste->waste->name }}</td>
                <td>{{ $waste->package->name }}</td>
                <td>{{ $waste->actual_weight }}</td>
                <td>{{ $waste->package_quantity }}</td>
                <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
                <td>{{ $waste->guide->date_verified }}</td>
                <td>{{ $waste->stat_stock == 1 ? 'Gestionado' : 'Pendiente' }}</td>
                <td>{{ $waste->stat_departure == 1 ? 'Gestionado' : 'Pendiente' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
