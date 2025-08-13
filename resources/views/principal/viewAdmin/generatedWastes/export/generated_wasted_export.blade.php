<table>

    <thead>
        <tr>
            <th>N°</th>
            <th>Nro. de Guía de Internamiento</th>
            <th>Fecha de verificación</th>
            <th>Lote</th>
            <th>Etapa</th>
            <th>Site/Locación</th>
            <th>Área/Proyecto</th>
            <th>Empresa</th>
            <th>Frente</th>
            <th>Clase</th>
            <th>Nombre de residuo</th>
            <th>Tipo de empaque</th>
            <th>Peso Real (kg)</th>
            <th>Nro. de bultos</th>
            <th>Volumen de la carga</th>
            <th>Fecha de salida del residuo</th>
            <th>Fecha de salida Malvinas</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($generatedWastes as $waste)

        <tr>
            <td>{{ $waste->id }}</td>
            <td>{{ $waste->guide->code }}</td>
            <td>{{ $waste->guide->date_verified }}</td>
            <td>{{ $waste->guide->warehouse->lot->name ?? '-' }}</td>
            <td>{{ $waste->guide->warehouse->stage->name ?? '-' }}</td>
            <td>{{ $waste->guide->warehouse->location->name ?? '-' }}</td>
            <td>{{ $waste->guide->warehouse->projectArea->name ?? '-' }}</td>
            <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
            <td>{{ $waste->guide->warehouse->front->name ?? '-' }}</td>
            <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
            <td>{{ $waste->waste->name }}</td>
            <td>{{ $waste->package->name }}</td>
            <td>{{ $waste->actual_weight }}</td>
            <td>{{ $waste->package_quantity }}</td>
            <td>{{ $waste->packingGuide->volum ?? '-' }}</td>
            <td>{{ $waste->packingGuide->date_guides_departure ?? '-' }}</td>
            <td>{{ $waste->date_departure ?? '-' }}</td>
        </tr>

        @endforeach

    </tbody>

</table>
