<?php

namespace App\Exports;

use App\Services\{GeneratedWastesService};
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\{
    Exportable,
    FromQuery,
    ShouldAutoSize,
    WithCustomChunkSize,
    WithHeadings,
    WithMapping
};

class GeneratedWastesExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize
// class GeneratedWastesExport implements ShouldQueue, FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize
{
    // use Exportable, Queueable;
    use Exportable;

    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function query()
    {
        return app(GeneratedWastesService::class)->getQueryByFilters($this->request);
    }


    public function headings(): array
    {
        return [
            'N°',
            'Nro. de Guía',
            'Fecha',
            'Punto Verde',
            'Lote',
            'Locación',
            'Actividad',
            'Área',
            'Empresa',
            'Código',
            'Residuo',
            'Clase',
            'Grupo',
            'Gestión',
            'Peso (kg)',
        ];
    }

    public function map($waste): array
    {
        return [
            $waste->id,
            $waste->guide->code,
            getOnlyDate($waste->guide->created_at),
            $waste->guide->warehouse->name,
            $waste->guide->warehouse->lot->name ?? '-' ,
            $waste->guide->warehouse->location->name ?? '-',
            $waste->guide->warehouse->activity ?? '-',
            $waste->guide->warehouse->projectArea->name ?? '-',
            $waste->guide->warehouse->company->name ?? '-',
            $waste->guide->warehouse->code ?? '-',
            $waste->waste->name,
            $waste->waste->classesWastes->first()->symbol ?? '-',
            $waste->waste->classesWastes->first()->group->name ?? '-',
            config('parameters.gestion_types')[$waste->gestion_type] ?? '-',
            $waste->aprox_weight == 0 ? '0' : $waste->aprox_weight,
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
