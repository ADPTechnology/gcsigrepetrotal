<div class="overflow-auto">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>N° Guía Green Care</th>
                <th>Destino</th>
                <th>Placa camión Pucallpa</th>
                <th>Peso recibido</th>
                {{-- <th>Dif. peso Malv-Pucall</th> --}}
                <th>Fecha de salida de pucallpa</th>

                <th>Guía de DDFF</th>
                <th>Peso DDFF</th>
                <th>Diferencia de pesos</th>
                <th>Lugar de disposición</th>
                <th>N° de Boleta</th>
                <th>N°/Certificado</th>
                <th>Placa de camión</th>
                <th>Reporte Gestión</th>
                <th>Observación DF</th>
                <th>Fecha de DDFF</th>
                <th>Estado disposición</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td>{{ $disposition->code_green_care }}</td>
                <td>{{ $disposition->destination }}</td>
                <td>{{ $disposition->plate_init }}</td>
                <td>{{ $disposition->weigth_init }}</td>
                {{-- <td>{{ $disposition->weigth_diff_init }}</td> --}}
                <td>{{ $disposition->date_departure }}</td>

                <td>{{ $disposition->code_dff ?? '-' }}</td>
                <td>{{ $disposition->weigth ?? '-' }}</td>
                <td>{{ $disposition->weigth_diff ?? '-' }}</td>
                <td>{{ $disposition->disposition_place ?? '-' }}</td>
                <td>{{ $disposition->code_invoice ?? '-' }}</td>
                <td>{{ $disposition->code_certification ?? '-' }}</td>
                <td>{{ $disposition->plate ?? '-' }}</td>
                <td>{{ $disposition->managment_report ?? '-' }}</td>
                <td>{{ $disposition->observations ?? '-' }}</td>
                <td>{{ $disposition->date_dff ?? '-' }}</td>
                <td>
                    @if ($disposition->status == 1)
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
        </tbody>

    </table>
</div>


<div class="text-bold p-2 mb-2 subtitle">
    Residuos:
</div>

<div class="overflow-auto">
    <table class="table table-sm table-hover">
        <thead>
            <tr>
                <th>Registro de salida de Residuos</th>
                <th>N° Guía de Internamiento</th>
                <th>Clase</th>
                <th>Nom. Residuo</th>
                <th>Tipo de embalaje</th>
                <th>Peso Real (Kg)</th>
                <th>Nro. Bultos</th>
                <th>Empresa</th>
                <th>Fecha de Guía</th>
                <th>Manejo/Gestión</th>
                <th>Estado salida</th>
                <th>Estada llegada</th>
                <th>Estado salida de Pucallpa</th>
                <th>Estado Disposición</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($disposition->wastes as $waste)
            <tr>
                <td>{{ $waste->packingGuide->cod_guide }}</td>
                <td>{{ $waste->guide->code }}</td>
                <td>{{ $waste->waste->classesWastes->first()->symbol ?? '-' }}</td>
                <td>{{ $waste->waste->name }}</td>
                <td>{{ $waste->package->name }}</td>
                <td>{{ $waste->actual_weight }}</td>
                <td>{{ $waste->package_quantity }}</td>
                <td>{{ $waste->guide->warehouse->company->name ?? '-' }}</td>
                <td>{{ $waste->guide->created_at }}</td>
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

        </tbody>

    </table>
</div>


