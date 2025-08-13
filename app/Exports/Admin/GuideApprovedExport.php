<?php

namespace App\Exports\Admin;

use App\Services\{InternmentGuideService};
use Maatwebsite\Excel\Concerns\{
    Exportable,
    FromQuery,
    ShouldAutoSize,
    WithCustomChunkSize,
    WithHeadings,
    WithMapping
};

class GuideApprovedExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize
{
    use Exportable;

    protected $table;

    public function __construct(string $table)
    {
        $this->table = $table;
    }

    public function query()
    {
        return app(InternmentGuideService::class)->getQuery($this->table);
    }

    public function headings(): array
    {
        return [
            'Nro de Guía',
            'Fecha de solicitud',
            'Lote',
            'Etapa',
            'Locación',
            'Área/Proyecto',
            'Empresa',
            'Frente',
            'Estado Aprobado',
            'Estado Recepcionado',
            'Estado Verificado'
        ];
    }

    public function map($guide): array
    {
        if ($guide->stat_approved == 1) { $stat_approved = "Aprobado"; }
        elseif ($guide->stat_rejected == 1) { $stat_approved = "Rechazado"; }
        else { $stat_approved = "Pendiente"; }

        if ($guide->stat_recieved == 1) { $stat_recieved = "Aprobado"; }
        elseif ($guide->stat_rejected == 1) { $stat_recieved = "Rechazado"; }
        else { $stat_recieved = "Pendiente"; }

        if ($guide->stat_verified == 1) { $stat_verified = "Aprobado"; }
        elseif ($guide->stat_rejected == 1) { $stat_verified = "Rechazado"; }
        else { $stat_verified = "Pendiente"; }

        return [
            $guide->code,
            $guide->created_at,
            $guide->warehouse->lot->name,
            $guide->warehouse->stage->name,
            $guide->warehouse->location->name,
            $guide->warehouse->projectArea->name,
            $guide->warehouse->company->name,
            $guide->warehouse->front->name,
            $stat_approved,
            $stat_recieved,
            $stat_verified
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
