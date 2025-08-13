<table>

    <thead>
        <tr>
            <th>Nro de Guía</th>
            <th>Fecha de solicitud</th>
            <th>Lote</th>
            <th>Etapa</th>
            <th>Locación</th>
            <th>Area / Proyecto</th>
            <th>Empresa</th>
            <th>Frente</th>
            <th>Estado Aprobado</th>
            <th>Estado Recepcionado</th>
            <th>Estado Verificado</th>
        </tr>
    </thead>

    <tbody>

        @foreach ($guides as $guide)

        <tr>
            <td>{{ $guide->code }}</td>
            <td>{{ $guide->created_at }}</td>
            <td>{{ $guide->warehouse->lot->name ?? '-' }}</td>
            <td>{{ $guide->warehouse->stage->name ?? '-' }}</td>
            <td>{{ $guide->warehouse->location->name ?? '-' }}</td>
            <td>{{ $guide->warehouse->projectArea->name ?? '-' }}</td>
            <td>{{ $guide->warehouse->company->name ?? '-' }}</td>
            <td>{{ $guide->warehouse->front->name ?? '-' }}</td>

            <td>
                @if ($guide->stat_approved == 1)
                Aprobado
                @elseif ($guide->stat_rejected == 1)
                Rechazado
                @else
                Pendiente
                @endif
            </td>
            <td>
                @if ($guide->stat_recieved == 1)
                Aprobado
                @elseif ($guide->stat_rejected == 1)
                Rechazado
                @else
                Pendiente
                @endif
            </td>
            <td>
                @if ($guide->stat_verified == 1)
                Aprobado
                @elseif ($guide->stat_rejected == 1)
                Rechazado
                @else
                Pendiente
                @endif
            </td>
        </tr>

        @endforeach

    </tbody>

</table>
