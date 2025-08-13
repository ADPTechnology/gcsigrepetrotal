@foreach ($departures as $departure)
<tr>
    <input name="departures-arrival-ids[]" type="hidden" value="{{ $departure->id }}'">
    <td>{{ $departure->ppc_code }}</td>
    <td>{{ $departure->manifest_code }}</td>
    <td>{{ $departure->cod_guide }}</td>
    <td>{{ $departure->wastes_sum_actual_weight }}</td>
    <td>{{ $departure->wastes_sum_package_quantity }}</td>
    <td>{{ $departure->volum ?? '-' }}</td>
    <td>{{ $departure->shipping_type ?? '-' }}</td>
    <td>{{ $departure->destination ?? '-' }}</td>
    <td>{{ $departure->date_departure ?? '-' }}</td>
    <td>
        @if ($departure->status ?? 0 == 1)
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
        @if ($departure->stat_arrival ?? 0 == 1)
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
