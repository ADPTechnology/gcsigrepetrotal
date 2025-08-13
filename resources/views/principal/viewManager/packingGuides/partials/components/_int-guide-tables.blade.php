<div style="overflow: auto;">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Nro. Guía</th>
                <th>Fecha</th>
                <th>Punto Verde</th>
                <th>Lote</th>
                <th>Locación</th>
                <th>Actividad</th>
                <th>Área</th>
                <th>Empresa</th>
                <th>Código</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td class="text-nowrap">{{ $guide->code }}</td>
                <td class="text-nowrap">{{ getOnlyDate($guide->created_at) }}</td>
                <td>{{ $guide->warehouse->name }}</td>
                <td>{{ $guide->warehouse->lot->name ?? '' }}</td>
                <td>{{ $guide->warehouse->location->name ?? '' }}</td>
                <td>{{ config('parameters.activities')[$guide->warehouse->activity] ?? '' }}</td>
                <td>{{ $guide->warehouse->projectArea->name ?? '' }}</td>
                <td>{{ $guide->warehouse->company->name ?? '' }}</td>
                <td class="text-nowrap">{{ $guide->warehouse->code }}</td>
            </tr>
        </tbody>

    </table>
</div>

<div class="ml-4 mb-3">
    <span class="font-weight-bold">
        Observaciones:
    </span>
    {{ $guide->comment ?? '-' }}
</div>

<div class="text-bold p-2 mb-2 subtitle">
    Residuos:
</div>

<div style="overflow: auto;">
    <table class="table table-sm table-hover">
        <thead>
            <tr>
                <th>Residuo</th>
                <th>Clase</th>
                <th>Grupo</th>
                <th>Gestión</th>
                <th>Peso (Kg)</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($guide->guideWastes as $waste)
            <tr>
                <td>{{ $waste->waste->name }}</td>
                <td>{{ $waste->waste->classesWastes->first()->symbol ?? '' }}</td>
                <td>{{ $waste->waste->classesWastes->first()->group->name ?? '' }}</td>
                <td>{{ config('parameters.gestion_types')[$waste->gestion_type] ?? '' }}</td>
                <td>{{ $waste->aprox_weight }}</td>
            </tr>
            @endforeach
        </tbody>

    </table>
</div>
