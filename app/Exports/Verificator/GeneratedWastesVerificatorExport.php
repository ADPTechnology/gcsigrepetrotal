<?php

namespace App\Exports\Verificator;

use App\Services\{GeneratedWastesService};
use Auth;
use Maatwebsite\Excel\Concerns\{
    Exportable,
    FromQuery,
    ShouldAutoSize,
    WithCustomChunkSize,
    WithHeadings,
    WithMapping
};
class GeneratedWastesVerificatorExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithCustomChunkSize
{
    use Exportable;

    protected $from_date, $end_date, $user;

    public function __construct(string $from_date, string $end_date, $user)
    {
        $this->from_date = $from_date;
        $this->end_date = $end_date;
        $this->user = $user;
    }

    public function query()
    {
        $from_date = $this->from_date;
        $end_date = $this->end_date;

        return app(GeneratedWastesService::class)->getQueryVerificatorByFilters($from_date, $end_date, $this->user);
    }

    public function headings(): array
    {
        return [
            'N°',
            'Nro. de Guía de Internamiento',
            'Fecha de aprobación ADC',
            'Fecha de verificación',
            'Lotes',
            'Etapa',
            'Site/Locación',
            'Área/Proyecto',
            'Empresa',
            'Frente',
            'Clase',
            'Nombre de residuo',
            'Tipo de empaque',
            'Peso Real (kg)',
            'Nro. de bultos',
            'Volumen de la carga',
            'Fecha de salida del residuo',
            'Fecha de salida Malvinas'
        ];
    }

    public function map($waste): array
    {
        return [
            $waste->id,
            $waste->guide->code,
            $waste->guide->date_approved,
            $waste->guide->date_verified,
            $waste->guide->warehouse->lot->name ?? '-' ,
            $waste->guide->warehouse->stage->name ?? '-',
            $waste->guide->warehouse->location->name ?? '-',
            $waste->guide->warehouse->projectArea->name ?? '-',
            $waste->guide->warehouse->company->name ?? '-',
            $waste->guide->warehouse->front->name ?? '-',
            $waste->waste->classesWastes->first()->symbol ?? '-',
            $waste->waste->name,
            $waste->package->name,
            $waste->actual_weight == 0 ? '0' : $waste->actual_weight,
            $waste->package_quantity,
            $waste->packingGuide->volum ?? '-',
            $waste->packingGuide->date_guides_departure ?? '-',
            $waste->date_departure ?? '-'
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }

}
