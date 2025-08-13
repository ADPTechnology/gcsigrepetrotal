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

class InternmentWastesExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize, WithStrictNullComparison
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

        return app(StockWastesService::class)->getQueryByFilters($from_date, $end_date, $status, 'intGuide');
    }

    public function headings(): array
    {
        return [
            'Nro. de Guía de Internamiento',
            'Clase',
            'Nombre de residuo',
            'Tipo de embalaje',
            'Peso Real (Kg)',
            'Nro. Bultos',
            'Empresa',
            'Fecha de Guía',
            'Fecha de verificación',
            'Manejo/gestión',
            'Estado Salida',
        ];
    }

    public function map($waste): array
    {
        return [
            $waste->guide->code,
            $waste->waste->classesWastes->first()->symbol ?? '-',
            $waste->waste->name,
            $waste->package->name,
            $waste->actual_weight,
            $waste->package_quantity,
            $waste->guide->warehouse->company->name ?? '-',
            $waste->guide->created_at,
            $waste->guide->date_verified,
            $waste->stat_stock == 1 ? 'Gestionado' : 'Pendiente',
            $waste->stat_departure == 1 ? 'Gestionado' : 'Pendiente',
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
