@foreach ($guides as $guide)
<tr>
    <input type="hidden" value="{{ $guide->id }}" name="guides-departure-selected[]">
    <td>{{ $guide->cod_guide ?? '' }}</td>
    <td>{{ $guide->wastes_sum_actual_weight ?? '' }}</td>
    <td>{{ $guide->wastes_sum_package_quantity ?? '' }}</td>
    <td>{{ $guide->volum ?? '-' }}</td>
    <td>{{ $guide->date_guides_departure ?? '-' }}</td>
    <td>
        @if ($guide->status ?? 0 == 1)
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
        @if ($guide->stat_arrival ?? 0 == 1)
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

