<?php

namespace App\Exports\Manager;

use App\Services\{StockWastesService};
use Maatwebsite\Excel\Concerns\{
    Exportable,
    FromQuery,
    ShouldAutoSize,
    WithCustomChunkSize,
    WithHeadings,
    WithMapping,
    WithStrictNullComparison
};

class DeparturesWastesExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize, WithStrictNullComparison
{
    use Exportable;

    private $from_date, $end_date, $status;

    public function __construct(string $from_date, string $end_date, string $status)
    {
        $this->from_date = $from_date;
        $this->end_date = $end_date;
        $this->status = $status;
    }

    public function query()
    {
        $from_date = $this->from_date;
        $end_date = $this->end_date;
        $status = $this->status;

        return app(StockWastesService::class)->getQueryByFilters($from_date, $end_date, $status, 'packing');
    }

    public function headings(): array
    {
        return [
            'Nro. Guía de Embalaje',
            'Nro. de Guía de Internamiento',
            'Clase',
            'Nombre de residuo',
            'Tipo de embalaje',
            'Peso Real (Kg)',
            'Nro. Bultos',
            'Empresa',
            'Fecha de Guía',
            'Fecha de salida del residuo',
            'Fecha de salida Malvinas',
            'Volumen de la Carga (m3)',
            'Manejo/gestión',
            'Salida',
            'Registrado el'
        ];
    }

    public function map($waste): array
    {
        return [
            $waste->packingGuide->cod_guide,
            $waste->guide->code,
            $waste->waste->classesWastes->first()->symbol ?? '-',
            $waste->waste->name,
            $waste->package->name,
            $waste->actual_weight,
            $waste->package_quantity,
            $waste->guide->warehouse->company->name ?? '-',
            $waste->guide->created_at,
            $waste->packingGuide->date_guides_departure ?? '-',
            $waste->date_departure ?? '-',
            $waste->packingGuide->volum ?? '-',
            $waste->stat_stock == 1 ? 'Gestionado' : 'Pendiente',
            $waste->stat_departure == 1 ? 'Gestionado' : 'Pendiente',
            $waste->created_at,
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
