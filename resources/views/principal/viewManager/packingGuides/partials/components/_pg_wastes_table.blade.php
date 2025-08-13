@foreach ($wastes as $waste)
<tr>
    <td>{{ $waste->guide->code ?? '' }}</td>
    <td>{{ $waste->waste->classesWastes->first()->symbol ?? '' }}</td>
    <td>{{ $waste->waste->name ?? '' }}</td>
    <td>{{ $waste->package->name ?? '' }}</td>
    <td>{{ $waste->actual_weight ?? '' }}</td>
    <td>{{ $waste->package_quantity ?? '' }}</td>
    <td>{{ $waste->guide->warehouse->company->name ?? '' }}</td>
    <td>{{ $waste->guide->date_verified ?? '' }}</td>
    <td>
        @if ($waste->stat_stock == 1)
            <span class="badge badge-pill badge-success">
                Gestionado
            </span>
        @else
            <span class="badge badge-pill badge-warning">
                Pendiente
            </span>
        @endif
    </td>
    <td>
        @if ($waste->packingGuide->status ?? 0 == 1)
        <span class="badge badge-pill badge-success">
            Gestionado
        </span>
        @else
        <span class="badge badge-pill badge-warning">
            Pendiente
        </span>
        @endif
    </td>
    <td>
        @if ($waste->packingGuide->stat_arrival ?? 0 == 1)
        <span class="badge badge-pill badge-success">
            Gestionado
        </span>
        @else
        <span class="badge badge-pill badge-warning">
            Pendiente
        </span>
        @endif
    </td>
    <td>
        @if ($waste->stat_transport_departure ?? 0 == 1)
        <span class="badge badge-pill badge-success">
            Gestionado
        </span>
        @else
        <span class="badge badge-pill badge-warning">
            Pendiente
        </span>
        @endif
    </td>
    <td>
        @if ($waste->disposition->status ?? 0 == 1)
        <span class="badge badge-pill badge-success">
            Gestionado
        </span>
        @else
        <span class="badge badge-pill badge-warning">
            Pendiente
        </span>
        @endif
    </td>
</tr>
@endforeach
