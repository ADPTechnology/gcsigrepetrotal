<?php

namespace App\Exports;

use App\Services\{GeneratedWastesService};
use Maatwebsite\Excel\Concerns\{
    Exportable,
    FromQuery,
    WithHeadings,
    ShouldAutoSize,
    WithCustomChunkSize,
    WithEvents,
    WithCustomStartCell,
    WithMapping,
    WithStrictNullComparison
};
use Maatwebsite\Excel\Events\{
    AfterSheet,
};
use Maatwebsite\Excel\Sheet;
use PhpOffice\PhpSpreadsheet\Style\{
    Alignment,
    Border,
    Fill
};

class GeneratedWastesGeneralExport implements FromQuery, ShouldAutoSize, WithEvents, WithHeadings, WithMapping, WithCustomStartCell, WithCustomChunkSize
// class GeneratedWastesGeneralExport implements FromQuery, ShouldAutoSize, WithEvents, WithMapping, WithCustomStartCell, WithCustomChunkSize, ShouldQueue
// class GeneratedWastesGeneralExport implements FromQuery, ShouldAutoSize, WithEvents, WithCustomStartCell, WithMapping, WithCustomChunkSize, ShouldQueue
{
    use Exportable;

    protected $from_date, $end_date;

    public function __construct(string $from_date, string $end_date)
    {
        $this->from_date = $from_date;
        $this->end_date = $end_date;
    }

    public function startCell(): string
    {
        return 'A4';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                /** @var Sheet $sheet */
                $sheet = $event->sheet;

                $sheet->mergeCells('A1:CR1');
                $sheet->setCellValue('A1', 'REGISTRO DE REPORTE DIARIO DE GENERACIÓN DE RESIDUOS (Kg)');
                $sheet->mergeCells('CS1:CW1');
                $sheet->setCellValue('CS1', env('APP_NAME'));

                $sheet->mergeCells('A2:J2');
                $sheet->setCellValue('A2', '');
                $sheet->mergeCells('K2:AR2');
                $sheet->setCellValue('K2', 'RESIDUOS APROVECHABLES');
                $sheet->mergeCells('AS2:CG2');
                $sheet->setCellValue('AS2', 'RESIDUOS NO APROVECHABLES');
                $sheet->mergeCells('CH2:CR2');
                $sheet->setCellValue('CH2', 'TOTALES');
                $sheet->mergeCells('CS2:CW2');
                $sheet->setCellValue('CS2', 'TIPO DE RESIDUOS');

                $sheet->mergeCells('A3:J3');
                $sheet->setCellValue('A3', '');
                $sheet->mergeCells('K3:P3');
                $sheet->setCellValue('K3', 'ORGÁNICOS');
                $sheet->mergeCells('Q3:S3');
                $sheet->setCellValue('Q3', 'PAPEL/CARTÓN');
                $sheet->mergeCells('T3:AB3');
                $sheet->setCellValue('T3', 'PLÁSTICOS');
                $sheet->mergeCells('AC3:AG3');
                $sheet->setCellValue('AC3', 'METALES');
                $sheet->mergeCells('AH3:AJ3');
                $sheet->setCellValue('AH3', 'VIDRIO');
                $sheet->mergeCells('AK3:AN3');
                $sheet->setCellValue('AK3', 'PELIGROSOS SÓLIDOS');
                $sheet->mergeCells('AO3:AR3');
                $sheet->setCellValue('AO3', 'PELIGROSOS LÍQUIDOS');
                $sheet->mergeCells('AS3:BD3');
                $sheet->setCellValue('AS3', 'NO APROVECHABLES NO PELIGROSOS');
                $sheet->mergeCells('BE3:BW3');
                $sheet->setCellValue('BE3', 'PELIGROSOS SÓLIDOS');
                $sheet->mergeCells('BX3:CG3');
                $sheet->setCellValue('BX3', 'PELIGROSOS LÍQUIDOS');
                $sheet->mergeCells('CH3:CN3');
                $sheet->setCellValue('CH3', 'RESIDUOS NO PELIGROSOS');
                $sheet->mergeCells('CO3:CQ3');
                $sheet->setCellValue('CO3', 'RESIDUOS PELIGROSOS');
                $sheet->setCellValue('CR3', '');
                $sheet->mergeCells('CS3:CW3');
                $sheet->setCellValue('CS3', 'TOTALES');

                // $sheet->setCellValue('A4', 'Código Software');
                // $sheet->setCellValue('B4', 'Generador PPC(ADC)');

                $styleArray = [
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'font' => [
                        'bold' => true
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_MEDIUM,
                            'color' => ['rgb' => '000000'],
                        ]
                    ],
                ];

                $styleArray_2 = [
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ]
                    ],
                ];

                $cellRange_1 = 'A1:CW1';
                $cellRange_2 = 'A2:CW2';
                $cellRange_3 = 'A3:CW3';
                $cellRange_4 = 'A4:CW4';
                $event->sheet->getDelegate()->getStyle($cellRange_1)->applyFromArray($styleArray)->getFont()->setSize(15);
                $event->sheet->getDelegate()->getStyle($cellRange_2)->applyFromArray($styleArray)->getFont()->setSize(12);
                $event->sheet->getDelegate()->getStyle($cellRange_3)->applyFromArray($styleArray)->getFont()->setSize(12);
                $event->sheet->getDelegate()->getStyle($cellRange_4)->applyFromArray($styleArray_2);

                $cellRange_2_1 = 'A2:CR2';
                $event->sheet->getDelegate()->getStyle($cellRange_2_1)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('fcbd8d');
                $cellRange_2_2 = 'CS2:CW2';
                $event->sheet->getDelegate()->getStyle($cellRange_2_2)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FADDD2');
            }
        ];
    }

    public function query()
    {
        return (app(GeneratedWastesService::class)->getQueryByFilters($this->from_date, $this->end_date));
    }

    public function headings(): array
    {
        return [
            'Código Software',
            'Generador PPC(ADC)',
            'Fecha',
            'Mes',
            'Lote',
            'Etapa',
            'Site',
            'Area / Proyecto',
            'Empresa',
            'Frente',
            'RNPD-01-Residuos de Comida (Malvinas)',
            'RNPD-02-Residuos de Comida (Locaciones)',
            'RNDP-03-Restos de Jardinería',
            'RNPI-04-Madera (CAJAS DE MADERA)',
            'RNPI-04-Madera (PARIHUELA)',
            'TOTAL ORGANICOS APROVECHABLES',
            'RNPI-05-Papel',
            'RNPI-06-Carton',
            'TOTAL PAPEL/CARTON APROVECHABLE',
            'RNPI-07-PET',
            'RNPI-08-PVC',
            'RNPI-09-Plasico Duro',
            'RNPI-10-Geomembrana',
            'RNPI-11-Bolsas Plasticas',
            'RNPI-12-Neumáticos fuera de uso (llantas usadas)',
            'RNPI-13-Sacos',
            'RNPI-14-Strech Film',
            'TOTAL PLASTICOS APROVECHABLES',
            'RNPI-15-Residuos metálicos',
            'RNPI-16-Restos cables eléctricos',
            'RNPI-17-Latas',
            'RNPI-18-Residuos electronicos RAEE',
            'TOTAL METALES APROVECHABLES',
            'RNPI-19-Vidrio',
            'RNPI-20-Ceramicas',
            'TOTAL VIDRIO APROVECHABLES',
            'RPSO-21-Baterias de Acido-Plomo usadas',
            'RPSO-22-Baterias Niquel-Cadmio',
            'RPSO-23-Cartuchos de impresora',
            'TOTAL PELIGROSOS SOLIDOS APROVECHABLES',
            'RPLI-24-Hidrocarburo Recuperables liquido',
            'RPLI-25-Aceite Mineral residual (aceite quemado)',
            'RPLI-26-Aceite vegetal (Frituras)',
            'TOTAL PELIGROSOS LIQUIDOS APROVECHABLES',
            'RNPI-27-Restos de Madera',
            'RNPI-28-Bolsas Plasticas No Aprovechable',
            'RNPI-29-Restos de Concreto',
            'RNPI-30-Filtros Usados No Aprovechable',
            'RNPI-31-Residuos Textiles No Aprovechable',
            'RNPI-32-Colchones en desuso',
            'RNPI-33-Lodos deshidratados del Sistema PTARD',
            'RNPI-34-EPPs usados',
            'RNPI-35-Jebes',
            'RNPI-36-Garnet',
            'RNPI-37-Residuos no aprovechables generales',
            'TOTAL GENERALES NO APROVECHABLES',
            'RPSO-38-Suelo/Tierra contaminada con Hidrocarburo',
            'RPSO-39-Tamiz molecular (PDG)',
            'RPSO-40-Floculos',
            'RPSO-41-Ceniza de incineración',
            'RPSO-42-Prevencion Sanitaria',
            'RPSO-43-Recipientes de gases comprimidos en desuso',
            'RPSO-44-Residuos Hospitalarios',
            'RPSO-45-Fluorescentes',
            'RPSO-46-Pilas usadas',
            'RPSO-47-Arena/Grava Cama de Secado',
            'RPSO-48-Cajas de madera contaminada con Pintura',
            'RPSO-49-Cilindros Metalicos contaminados con hidrocarburo',
            'RPSO-50-Cilindros Plasticos contaminados con Trietilenglicol (TEG)',
            'RPSO-51-Parihuelas de Madera contaminadas con hidrocarburo',
            'RPSO-52-Recipientes de Becorin (Bulk Drum)',
            'RPSO-53-Recorte de perforacion',
            'RPSO-54-Otros productos quimicos solidos peligrosos',
            'RPSO-55-Residuos peligrosos Solidos no aprovechables',
            'TOTAL PELIGROSOS SOLIDOS NO APROVECHABLES',
            'RPLI-56-Grasas (Trampas de cocina)',
            'RPLI-57-Lixiviado de compactacion (grasas y solidos)',
            'RPLI-58-Floculantes',
            'RPLI-59-Lodos de perforación',
            'RPLI-60-Agua Oleosa',
            'RPLI-61-Lodos con aguas residuales domesticas',
            'RPLI-62-Residuos de baños portatiles',
            'RPLI-63-Otros productos quimicos liquidos peligrosos',
            'RPLI-64-Residuos peligrosos liquidos no aprovechables',
            'TOTAL PELIGROSOS LIQUIDOS NO APROVECHABLES',
            'Orgánicos',
            'Papel/ Cartón',
            'Plástico',
            'Metales',
            'Vidrios',
            'No Aprovechables',
            'Total No Peligrosos',
            'Peligrosos Sólidos',
            'Peligrosos Líquidos',
            'Total Peligrosos',
            'TOTAL DE RESIDUOS',
            'TOTAL RNPD',
            'TOTAL RNPI',
            'TOTAL RPS',
            'TOTAL RPL',
            'TOTAL RESIDUOS'
        ];
    }

    public function map($waste): array
    {
        return app(GeneratedWastesService::class)->getReportArray($waste, $this->headings());
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
