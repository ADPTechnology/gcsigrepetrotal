@foreach ($guides as $guide)

    <tr>
        <input type="hidden" value="{{ $guide->id }}" name="guides-departure-selected[]">
        <td>{{ $guide->cod_guide ?? '' }}</td>
        <td>{{ $guide->wastes_sum_aprox_weight ?? '' }}</td>
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

@if (isset($gestion_type) && $gestion_type == 'EXTERNA')
    <tr>
        <th style="background-color: #0000000a" class="font-weight-bold">Fecha de Zarpe</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Barcaza</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Bultos</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Tipo de Embalaje</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Peso Kg (Transber) (Grúa)</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Tn</th>
    </tr>


    <tr>
        <td>{{ $guide->sailing_date ?? '-' }}</td>
        <td>{{ $guide->barge ?? '-' }}</td>
        <td>{{ $guide->packages ?? '-' }}</td>
        <td>{{ $guide->packaging_type ?? '-' }}</td>
        <td>{{ $guide->crane_weight_kg ?? '-' }}</td>
        <td>{{ $guide->crane_weight_kg ? $guide->crane_weight_kg / 1000 : '-' }}</td>
    </tr>

    <tr>
        <th style="background-color: #0000000a" class="font-weight-bold" colspan="2">Guia Green Care del Perú - Transportista</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Placa</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Guia Green Care del Perú</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Fecha de Disposición</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Comprobante Pesaje</th>
    </tr>

    <tr>
        <td colspan="2">{{ $guide->carrier_guide ?? '-' }}</td>
        <td>{{ $guide->plate_number ?? '-' }}</td>
        <td>{{ $guide->greencare_guide ?? '-' }}</td>
        <td>{{ $guide->disposal_date ?? '-' }}</td>
        <td>{{ $guide->weighing_receipt ?? '-' }}</td>
    </tr>


    <tr>
        <th style="background-color: #0000000a" class="font-weight-bold">Peso (Kg) DD.FF</th>
        <th style="background-color: #0000000a" class="font-weight-bold">Tn</th>
        <th colspan="2" style="background-color: #0000000a" class="font-weight-bold">Empresa: Disposición Final</th>
    </tr>

    <tr>
        <td>{{ $guide->ddff_weight_kg ?? '-' }}</td>
        <td>{{ $guide->ddff_weight_kg ? $guide->ddff_weight_kg / 1000 : '-' }}</td>
        <td colspan="2">{{ $guide->disposal_company ?? '-' }}</td>
    </tr>

@endif
