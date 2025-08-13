<?php

namespace App\Services;

use App\Models\{GuideWaste};
use Illuminate\Http\Request;
use DataTables;
use Carbon\Carbon;
use Illuminate\Support\Str;

class GeneratedWastesService
{
    public function getDatatable(Request $request)
    {
        $query = $this->getQueryByFilters($request);

        $allWastes = DataTables::of($query)
            ->editColumn('guide.code', function ($waste) {
                $guide = $waste->guide;
                return '<a href="" class="btn-show-internmentGuide" data-url="' . route('loadInternmentGuide.manager', $guide) . '">' . $guide->code . '</a>';
            })
            ->editColumn('guide.created_at', function ($waste) {
                return getOnlyDate($waste->guide->created_at);
            })
            ->addColumn('waste.classes_wastes.symbol', function ($waste) {
                return $waste->waste->classesWastes->first()->symbol ?? '-';
            })
            ->addColumn('waste.classes_wastes.group.name', function ($waste) {
                return $waste->waste->classesWastes->first()->group->name ?? '-';
            })
            ->addColumn('action', function ($waste) {
                $btn = '<button data-toggle="modal" data-id="' .
                    $waste->id . '"
                    data-url="' . route('admin.guidewaste.update', $waste) . '"
                    data-send="' . route('admin.guidewaste.edit', $waste) . '"
                    data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                    editWaste"><i class="fa-solid fa-pen-to-square"></i></button>';

                $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                    $waste->id . '" data-original-title="delete"
                    data-url="' . route('admin.guidewaste.delete', $waste) . '"
                    class="ms-3 edit btn btn-danger btn-sm
                    deleteWaste"><i class="fa-solid fa-trash-can"></i></a>';

                return $btn;
            })
            ->rawColumns(['guide.code', 'action'])
            ->make(true);

        return $allWastes;
    }

    public function getQueryByFilters($request)
    {
        // $query = GuideWaste::
        // select([
        //     'guide_wastes.id',
        //     'guide_wastes.actual_weight',
        //     'guide_wastes.package_quantity',
        //     'guide_wastes.date_departure',
        //     'guide_wastes.id_guide',
        //     'guide_wastes.id_wasteType',
        //     'guide_wastes.id_packageType',
        //     'guide_wastes.id_packing_guide',
        //     'guide_wastes.id_departure',
        //     'guide_wastes.id_disposition'
        // ])
        // ->join('internment_guides', 'internment_guides.id', '=', 'guide_wastes.id_guide')
        // ->orderByDesc('internment_guides.date_verified')
        // ->whereHas('guide', function ($query) {
        //     $query->where('stat_approved', 1)
        //         ->where('stat_recieved', 1)
        //         ->where('stat_verified', 1);
        // })
        // ->with([
        //     'waste' => fn($q) =>
        //         $q->select([
        //             'waste_types.id',
        //             'waste_types.name'
        //             ])
        //             ->with(['classesWastes']),
        //     'guide' => fn ($q) =>
        //     $q
        //     ->select([
        //         'internment_guides.id',
        //         'internment_guides.date_approved',
        //         'internment_guides.date_verified',
        //         'internment_guides.id_warehouse',
        //         'internment_guides.code'
        //     ])
        //     ->with([
        //         'warehouse' => fn ($q) =>
        //         $q
        //         ->select([
        //             'warehouses.id',
        //             'warehouses.id_lot',
        //             'warehouses.id_stage',
        //             'warehouses.id_location',
        //             'warehouses.id_project_area',
        //             'warehouses.id_company',
        //             'warehouses.id_front'
        //         ])
        //         ->with([
        //             'company:id,name',
        //             'front:id,name',
        //             'location:id,name',
        //             'lot:id,name',
        //             'projectArea:id,name',
        //             'stage:id,name'
        //         ])
        //     ]),
        //     'package:id,name',
        //     'packingGuide:id,volum,date_guides_departure'
        // ]);

        // if ($from_date && $end_date) {

        //     $query = $query->whereHas('guide', function ($q) use ($from_date, $end_date) {
        //         $q->whereBetween('internment_guides.date_verified', [$from_date, $end_date]);
        //     });
        // }

        $query = GuideWaste::query()
            ->has('guide')
            ->whereNotNull('gestion_type')
            // ->whereHas('guide', function ($query) {
            //     $query->where('stat_approved', 1)
            //         ->where('stat_recieved', 1)
            //         ->where('stat_verified', 1);
            // })
            ->with([
                'waste.classesWastes.group',
                'guide.warehouse.company',
                'guide.warehouse.lot',
                'guide.warehouse.location',
                'guide.warehouse.projectArea',
                // 'package',
                // 'packingGuide'
            ])
            ->select('guide_wastes.*');

        if ($request->filled('from_date') && $request->filled('end_date')) {

            $startDay = Carbon::parse($request['from_date'])->startOfDay();
            $endDay = Carbon::parse($request['end_date'])->endOfDay();

            $query = $query->whereHas('guide', function ($q) use ($startDay, $endDay) {
                $q->whereBetween('internment_guides.created_at', [$startDay, $endDay]);
            });
        }

        if ($request->filled('warehouse')) {
            $query->whereHas('guide', function ($q) use ($request) {
                $q->where('internment_guides.id_warehouse', $request['warehouse']);
            });
        }

        if ($request->filled('company')) {
            $query->whereHas('guide.warehouse', function ($q) use ($request) {
                $q->where('warehouses.id_company', $request['company']);
            });
        }

        if ($request->filled('code')) {
            $query->whereHas('guide.warehouse', function ($q) use ($request) {
                $q->where('warehouses.code', $request['code']);
            });
        }

        if ($request->filled('wastetype')) {
            $query->where('guide_wastes.id_wasteType', $request['wastetype']);
        }

        if ($request->filled('group')) {
            $query->whereHas('waste.classesWastes', function ($q) use ($request) {
                $q->where('waste_classes.group_id', $request['group']);
            });
        }

        return $query;
    }

    public function getQueryVerificatorByFilters($from_date, $end_date, $user)
    {
        $query = GuideWaste::select([
                'guide_wastes.id',
                'guide_wastes.actual_weight',
                'guide_wastes.package_quantity',
                'guide_wastes.date_departure',
                'guide_wastes.id_guide',
                'guide_wastes.id_wasteType',
                'guide_wastes.id_packageType',
                'guide_wastes.id_packing_guide',
                'guide_wastes.id_departure',
                'guide_wastes.id_disposition'
            ])
            ->join('internment_guides', 'internment_guides.id', '=', 'guide_wastes.id_guide')
            ->orderByDesc('internment_guides.date_verified')
            ->whereHas('guide', function ($query) use ($user) {
                $query->where('stat_approved', 1)
                    ->where('stat_recieved', 1)
                    ->where('stat_verified', 1)
                    ->where('id_checker', $user->id);
            })
            ->with([
                'waste' => fn($q) =>
                $q->select([
                    'waste_types.id',
                    'waste_types.name'
                ])
                    ->with(['classesWastes']),
                'guide' => fn($q) =>
                $q
                    ->select([
                        'internment_guides.id',
                        'internment_guides.date_approved',
                        'internment_guides.date_verified',
                        'internment_guides.id_warehouse',
                        'internment_guides.code'
                    ])
                    ->with([
                        'warehouse' => fn($q) =>
                        $q
                            ->select([
                                'warehouses.id',
                                'warehouses.id_lot',
                                'warehouses.id_stage',
                                'warehouses.id_location',
                                'warehouses.id_project_area',
                                'warehouses.id_company',
                                'warehouses.id_front'
                            ])
                            ->with([
                                'company:id,name',
                                'front:id,name',
                                'location:id,name',
                                'lot:id,name',
                                'projectArea:id,name',
                                'stage:id,name'
                            ])
                    ]),
                'package:id,name',
                'packingGuide:id,volum,date_guides_departure'
            ]);

        if ($from_date && $end_date) {

            $query = $query->whereHas('guide', function ($q) use ($from_date, $end_date) {
                $q->whereBetween('internment_guides.date_verified', [$from_date, $end_date]);
            });
        }

        return $query;
    }

    public function initializeReportArray(array $array)
    {
        return array_reduce($array, function ($result, $item) {
            $result[$item] = '0';
            return $result;
        }, array());
    }

    public function getReportHeader($waste)
    {
        return [
            'Código Software' => $waste->id,
            'Generador PPC(ADC)' => 'Organico Locaciones',
            'Fecha' => Carbon::parse($waste->guide->date_verified)->toDateString() ?? '-',
            'Mes' => ucfirst(Carbon::parse($waste->guide->date_verified)->formatLocalized('%B')) ?? '-',
            'Lote' => $waste->guide->warehouse->lot->name ?? '-',
            'Etapa' => $waste->guide->warehouse->stage->name ?? '-',
            'Site' => $waste->guide->warehouse->location->name ?? '-',
            'Area / Proyecto' => $waste->guide->warehouse->projectArea->name ?? '-',
            'Empresa' => $waste->guide->warehouse->company->name ?? '-',
            'Frente' => $waste->guide->warehouse->front->name ?? '-',
        ];
    }

    public function getWasteQttyFromName($waste, array $array_names)
    {
        return Str::containsAll(mb_strtoupper($waste->waste->name ?? '', 'UTF-8'), $array_names) ?
            ($waste->actual_weight == 0 ? '0' : $waste->actual_weight) : '0';
    }

    public function getReportBody($waste)
    {
        $waste_class = mb_strtoupper($waste->waste->classesWastes->first()->symbol ?? '', 'UTF-8');

        $merge_array = [];

        //* ------------ Bloque Orgánico ------------

        $org_total = 0;
        $org_total_RNPD = 0;
        $org_total_RNPI = 0;

        if (Str::containsAll($waste_class, ['ORGÁNICO'])) {

            $RNPD_1 = $this->getWasteQttyFromName($waste, ['RESTOS DE COMIDA', 'MALVINAS']);
            $RNPD_2 = $this->getWasteQttyFromName($waste, ['RESTOS DE COMIDA', 'LOCACIONES']);
            $RNPD_3 = $this->getWasteQttyFromName($waste, ['RESTOS DE JARDINERÍA']);
            $RNPI_4_1 = $this->getWasteQttyFromName($waste, ['CAJAS DE MADERA']);
            $RNPI_4_2 = $this->getWasteQttyFromName($waste, ['PARIHUELAS DE MADERA']);

            $org_total_RNPD = $RNPD_1 + $RNPD_2 + $RNPD_3;
            $org_total_RNPI = $RNPI_4_1 + $RNPI_4_2;

            $org_total = array_sum([$org_total_RNPD, $org_total_RNPI]);

            $merge_array = [
                'RNPD-01-Residuos de Comida (Malvinas)' => $RNPD_1,
                'RNPD-02-Residuos de Comida (Locaciones)' => $RNPD_2,
                'RNDP-03-Restos de Jardinería' => $RNPD_3,
                'RNPI-04-Madera (CAJAS DE MADERA)' => $RNPI_4_1,
                'RNPI-04-Madera (PARIHUELA)' => $RNPI_4_2,
                'TOTAL ORGANICOS APROVECHABLES' => $org_total == 0 ? '0' : $org_total,
            ];
        }

        //* ---------- Bloque Papel cartón ------------

        $pc_total = 0;

        if (Str::containsAll($waste_class, ['PAPEL', 'CARTÓN'])) {

            $RNPI_5 = $this->getWasteQttyFromName($waste, ['PAPEL']);
            $RNPI_6 = $this->getWasteQttyFromName($waste, ['CARTON']);

            $pc_total = array_sum([$RNPI_5, $RNPI_6]);

            $merge_array = [
                'RNPI-05-Papel' => $RNPI_5,
                'RNPI-06-Carton' => $RNPI_6,
                'TOTAL PAPEL/CARTON APROVECHABLE' => $pc_total == 0 ? '0' : $pc_total,
            ];
        }

        //* ---------- Bloque plásticos aprovechables ------------

        $plasticos_a_total = 0;

        if (Str::containsAll($waste_class, ['PLÁSTICOS'])) {

            $RNPI_7 = $this->getWasteQttyFromName($waste, ['PET']);
            $RNPI_8 = $this->getWasteQttyFromName($waste, ['PVC']);
            $RNPI_9 = $this->getWasteQttyFromName($waste, ['PLASTICO DURO']);
            $RNPI_10 = $this->getWasteQttyFromName($waste, ['GEOMEMBRANA']);
            $RNPI_11 = $this->getWasteQttyFromName($waste, ['BOLSAS', 'PLASTICAS']);
            $RNPI_12 = $this->getWasteQttyFromName($waste, ['NEUMATICO']);
            $RNPI_13 = $this->getWasteQttyFromName($waste, ['SACOS']);
            $RNPI_14 = $this->getWasteQttyFromName($waste, ['STRECH', 'FILM']);

            $plasticos_a_total = array_sum([$RNPI_7, $RNPI_8, $RNPI_9, $RNPI_10, $RNPI_11, $RNPI_12, $RNPI_13, $RNPI_14]);

            $merge_array = [
                'RNPI-07-PET' => $RNPI_7,
                'RNPI-08-PVC' => $RNPI_8,
                'RNPI-09-Plasico Duro' => $RNPI_9,
                'RNPI-10-Geomembrana' => $RNPI_10,
                'RNPI-11-Bolsas Plasticas' => $RNPI_11,
                'RNPI-12-Neumáticos fuera de uso (llantas usadas)' => $RNPI_12,
                'RNPI-13-Sacos' => $RNPI_13,
                'RNPI-14-Strech Film' => $RNPI_14,
                'TOTAL PLASTICOS APROVECHABLES' => $plasticos_a_total == 0 ? '0' : $plasticos_a_total,
            ];
        }

        // * ------------ Bloque metales ----------

        $metales_total = 0;

        if (Str::containsAll($waste_class, ['METALES'])) {

            $RNPI_15 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'METÁLICOS']);
            $RNPI_16 = $this->getWasteQttyFromName($waste, ['RESTOS', 'CABLES']);
            $RNPI_17 = $this->getWasteQttyFromName($waste, ['LATAS']);
            $RNPI_18 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'RAEE']);

            $metales_total = array_sum([$RNPI_15, $RNPI_16, $RNPI_17, $RNPI_18]);

            $merge_array = [
                'RNPI-15-Residuos metálicos' => $RNPI_15,
                'RNPI-16-Restos cables eléctricos' => $RNPI_16,
                'RNPI-17-Latas' => $RNPI_17,
                'RNPI-18-Residuos electronicos RAEE' => $RNPI_18,
                'TOTAL METALES APROVECHABLES' => $metales_total == 0 ? '0' : $metales_total,
            ];
        }

        // * ------------ Bloque vidrios ------------

        $vidrios_total = 0;

        if (Str::containsAll($waste_class, ['VIDRIO'])) {

            $RNPI_19 = $this->getWasteQttyFromName($waste, ['VIDRIO']);
            $RNPI_20 = $this->getWasteQttyFromName($waste, ['CERAMICAS']);

            $vidrios_total = array_sum([$RNPI_19, $RNPI_20]);

            $merge_array = [
                'RNPI-19-Vidrio' => $RNPI_19,
                'RNPI-20-Ceramicas' => $RNPI_20,
                'TOTAL VIDRIO APROVECHABLES' => $vidrios_total == 0 ? '0' : $vidrios_total,
            ];
        }

        // * ----------- bLoque P S A --------------

        $psa_total = 0;

        if (Str::containsAll($waste_class, ['PELIGROSOS', 'SÓLIDOS', 'APROVECHABLES'])) {

            $RPSO_21 = $this->getWasteQttyFromName($waste, ['BATERIAS', 'PLOMO', 'USADAS']);
            $RPSO_22 = $this->getWasteQttyFromName($waste, ['BATERIAS', 'NIQUEL']);
            $RPSO_23 = $this->getWasteQttyFromName($waste, ['CARTUCHOS', 'IMPRESORA']);

            $psa_total = array_sum([$RPSO_21, $RPSO_22, $RPSO_23]);

            $merge_array = [
                'RPSO-21-Baterias de Acido-Plomo usadas' => $RPSO_21,
                'RPSO-22-Baterias Niquel-Cadmio' => $RPSO_22,
                'RPSO-23-Cartuchos de impresora' => $RPSO_23,
                'TOTAL PELIGROSOS SOLIDOS APROVECHABLES' => $psa_total == 0 ? '0' : $psa_total,
            ];
        }

        // * ---------- Bloque P L A ---------------

        $pla_total = 0;

        if (Str::containsAll($waste_class, ['PELIGROSOS', 'LÍQUIDOS', 'APROVECHABLES'])) {

            $RPLI_24 = $this->getWasteQttyFromName($waste, ['HIDROCARBUROS', 'LIQUIDO']);
            $RPLI_25 = $this->getWasteQttyFromName($waste, ['ACEITE', 'MINERAL']);
            $RPLI_26 = $this->getWasteQttyFromName($waste, ['ACEITE', 'VEGETAL']);

            $pla_total = array_sum([$RPLI_24, $RPLI_25, $RPLI_26]);

            $merge_array = [
                'RPLI-24-Hidrocarburo Recuperables liquido' => $RPLI_24,
                'RPLI-25-Aceite Mineral residual (aceite quemado)' => $RPLI_25,
                'RPLI-26-Aceite vegetal (Frituras)' => $RPLI_26,
                'TOTAL PELIGROSOS LIQUIDOS APROVECHABLES' => $pla_total == 0 ? '0' : $pla_total,
            ];
        }

        // * ------------ Bloque No Aprovechable No Peligroso --------------

        $na_np_total = 0;

        if (Str::containsAll($waste_class, ['NO APROVECHABLES', 'NO PELIGROSOS'])) {

            $RPLI_27 = $this->getWasteQttyFromName($waste, ['RESTOS', 'MADERA']);
            $RPLI_28 = $this->getWasteQttyFromName($waste, ['BOLSAS', 'PLASTICAS']);
            $RPLI_29 = $this->getWasteQttyFromName($waste, ['RESTOS', 'CONCRETO']);
            $RPLI_30 = $this->getWasteQttyFromName($waste, ['FILTROS', 'USADOS']);
            $RPLI_31 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'TEXTILES']);
            $RPLI_32 = $this->getWasteQttyFromName($waste, ['COLCHONES', 'DESUSO']);
            $RPLI_33 = $this->getWasteQttyFromName($waste, ['LODOS', 'DESHIDRATADOS']);
            $RPLI_34 = $this->getWasteQttyFromName($waste, ['EPPS', 'USADOS']);
            $RPLI_35 = $this->getWasteQttyFromName($waste, ['JEBE']);
            $RPLI_36 = $this->getWasteQttyFromName($waste, ['GARNET']);
            $RPLI_37 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'GENERALES']);

            $na_np_total = array_sum([$RPLI_27, $RPLI_28, $RPLI_29, $RPLI_30, $RPLI_31, $RPLI_32, $RPLI_33, $RPLI_34, $RPLI_35, $RPLI_36, $RPLI_37]);

            $merge_array = [
                'RNPI-27-Restos de Madera' => $RPLI_27,
                'RNPI-28-Bolsas Plasticas No Aprovechable' => $RPLI_28,
                'RNPI-29-Restos de Concreto' => $RPLI_29,
                'RNPI-30-Filtros Usados No Aprovechable' => $RPLI_30,
                'RNPI-31-Residuos Textiles No Aprovechable' => $RPLI_31,
                'RNPI-32-Colchones en desuso' => $RPLI_32,
                'RNPI-33-Lodos deshidratados del Sistema PTARD' => $RPLI_33,
                'RNPI-34-EPPs usados' => $RPLI_34,
                'RNPI-35-Jebes' => $RPLI_35,
                'RNPI-36-Garnet' => $RPLI_36,
                'RNPI-37-Residuos no aprovechables generales' => $RPLI_37,
                'TOTAL GENERALES NO APROVECHABLES' => $na_np_total == 0 ? '0' : $na_np_total,
            ];
        }

        // * ------------ Bloque Peligrosos sólidos no aprovechables ----------

        $na_ps_total = 0;

        if (Str::containsAll($waste_class, ['PELIGROSOS', 'SOLIDOS', 'NO APROVECHABLES'])) {

            $RPSO_38 = $this->getWasteQttyFromName($waste, ['TIERRA', 'CONTAMINADA', 'HIDROCARBUROS']);
            $RPSO_39 = $this->getWasteQttyFromName($waste, ['TAMIZ', 'MOLECULAR']);
            $RPSO_40 = $this->getWasteQttyFromName($waste, ['FLOCULOS']);
            $RPSO_41 = $this->getWasteQttyFromName($waste, ['CENIZA', 'INCINERACIÓN']);
            $RPSO_42 = $this->getWasteQttyFromName($waste, ['PREVENCIÓN', 'SANITARIA']);
            $RPSO_43 = $this->getWasteQttyFromName($waste, ['RECIPIENTES', 'GASES']);
            $RPSO_44 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'HOSPITALARIOS']);
            $RPSO_45 = $this->getWasteQttyFromName($waste, ['FLUORESCENTES']);
            $RPSO_46 = $this->getWasteQttyFromName($waste, ['PILAS', 'USADAS']);
            $RPSO_47 = $this->getWasteQttyFromName($waste, ['GRAVA', 'SECADO']);
            $RPSO_48 = $this->getWasteQttyFromName($waste, ['CAJAS', 'MADERA', 'PINTURA']);
            $RPSO_49 = $this->getWasteQttyFromName($waste, ['CILINDROS', 'METALICOS', 'CONTAMINADOS']);
            $RPSO_50 = $this->getWasteQttyFromName($waste, ['CILINDROS', 'PLASTICOS', 'CONTAMINADOS']);
            $RPSO_51 = $this->getWasteQttyFromName($waste, ['PARIHUELAS', 'MADERA', 'CONTAMINADAS']);
            $RPSO_52 = $this->getWasteQttyFromName($waste, ['RECIPIENTES', 'BULK', 'VACIOS']);
            $RPSO_53 = $this->getWasteQttyFromName($waste, ['RECORTE', 'PERFORACION']);
            $RPSO_54 = $this->getWasteQttyFromName($waste, ['OTROS', 'QUIMICOS', 'PELIGROSOS']);
            $RPSO_55 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'PELIGROSOS', 'SOLIDOS']);

            $na_ps_total = array_sum([
                $RPSO_38,
                $RPSO_39,
                $RPSO_40,
                $RPSO_41,
                $RPSO_42,
                $RPSO_43,
                $RPSO_44,
                $RPSO_45,
                $RPSO_46,
                $RPSO_47,
                $RPSO_48,
                $RPSO_49,
                $RPSO_50,
                $RPSO_51,
                $RPSO_52,
                $RPSO_53,
                $RPSO_54,
                $RPSO_55
            ]);

            $merge_array = [
                'RPSO-38-Suelo/Tierra contaminada con Hidrocarburo' => $RPSO_38,
                'RPSO-39-Tamiz molecular (PDG)' => $RPSO_39,
                'RPSO-40-Floculos' => $RPSO_40,
                'RPSO-41-Ceniza de incineración' => $RPSO_41,
                'RPSO-42-Prevencion Sanitaria' => $RPSO_42,
                'RPSO-43-Recipientes de gases comprimidos en desuso' => $RPSO_43,
                'RPSO-44-Residuos Hospitalarios' => $RPSO_44,
                'RPSO-45-Fluorescentes' => $RPSO_45,
                'RPSO-46-Pilas usadas' => $RPSO_46,
                'RPSO-47-Arena/Grava Cama de Secado' => $RPSO_47,
                'RPSO-48-Cajas de madera contaminada con Pintura' => $RPSO_48,
                'RPSO-49-Cilindros Metalicos contaminados con hidrocarburo' => $RPSO_49,
                'RPSO-50-Cilindros Plasticos contaminados con Trietilenglicol (TEG)' => $RPSO_50,
                'RPSO-51-Parihuelas de Madera contaminadas con hidrocarburo' => $RPSO_51,
                'RPSO-52-Recipientes de Becorin (Bulk Drum)' => $RPSO_52,
                'RPSO-53-Recorte de perforacion' => $RPSO_53,
                'RPSO-54-Otros productos quimicos solidos peligrosos' => $RPSO_54,
                'RPSO-55-Residuos peligrosos Solidos no aprovechables' => $RPSO_55,
                'TOTAL PELIGROSOS SOLIDOS NO APROVECHABLES' => $na_ps_total == 0 ? '0' : $na_ps_total,
            ];
        }

        // * ---------- Bloque peligrosos liquidos no aprovechables ------------

        $na_pl_total = 0;

        if (Str::containsAll($waste_class, ['PELIGROSOS', 'LIQUIDOS', 'NO APROVECHABLES'])) {

            $RPSO_56 = $this->getWasteQttyFromName($waste, ['GRASAS', 'TRAMPAS', 'COCINA']);
            $RPSO_57 = $this->getWasteQttyFromName($waste, ['LIXIVIADO', 'COMPACTACION']);
            $RPSO_58 = $this->getWasteQttyFromName($waste, ['FLOCULANTES']);
            $RPSO_59 = $this->getWasteQttyFromName($waste, ['LODOS', 'PERFORACIÓN']);
            $RPSO_60 = $this->getWasteQttyFromName($waste, ['AGUA', 'OLEOSA']);
            $RPSO_61 = $this->getWasteQttyFromName($waste, ['LODOS', 'AGUAS', 'RESIDUALES']);
            $RPSO_62 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'BAÑOS', 'PORTATILES']);
            $RPSO_63 = $this->getWasteQttyFromName($waste, ['OTROS', 'QUIMICOS', 'PELIGROSOS']);
            $RPSO_64 = $this->getWasteQttyFromName($waste, ['RESIDUOS', 'PELIGROSOS', 'LIQUIDO']);

            $na_pl_total = array_sum([$RPSO_56, $RPSO_57, $RPSO_58, $RPSO_59, $RPSO_60, $RPSO_61, $RPSO_62, $RPSO_63, $RPSO_64]);

            $merge_array = [
                'RPLI-56-Grasas (Trampas de cocina)' => $RPSO_56,
                'RPLI-57-Lixiviado de compactacion (grasas y solidos)' => $RPSO_57,
                'RPLI-58-Floculantes' => $RPSO_58,
                'RPLI-59-Lodos de perforación' => $RPSO_59,
                'RPLI-60-Agua Oleosa' => $RPSO_60,
                'RPLI-61-Lodos con aguas residuales domesticas' => $RPSO_61,
                'RPLI-62-Residuos de baños portatiles' => $RPSO_62,
                'RPLI-63-Otros productos quimicos liquidos peligrosos' => $RPSO_63,
                'RPLI-64-Residuos peligrosos liquidos no aprovechables' => $RPSO_64,
                'TOTAL PELIGROSOS LIQUIDOS NO APROVECHABLES' => $na_pl_total == 0 ? '0' : $na_pl_total,
            ];
        }

        $total_no_preligrosos = array_sum([$org_total, $pc_total, $plasticos_a_total, $metales_total, $vidrios_total, $na_np_total]);
        $total_peligrosos = array_sum([$na_ps_total, $na_pl_total]);
        $total_residuos_1 = array_sum([$total_no_preligrosos, $total_peligrosos]);

        $total_RNPD = $org_total_RNPD;
        $total_RNPI = array_sum([$org_total_RNPI, $pc_total, $plasticos_a_total, $metales_total, $vidrios_total, $na_np_total]);
        $total_RPS = array_sum([$psa_total, $na_ps_total]);
        $total_RPL = array_sum([$pla_total, $na_pl_total]);

        $total_residuos_2 = array_sum([$total_RNPD, $total_RNPI, $total_RPS, $total_RPL]);

        return $merge_array + [
            'Orgánicos' => $org_total == 0 ? '0' : $org_total,
            'Papel/ Cartón' => $pc_total == 0 ? '0' : $pc_total,
            'Plástico' => $plasticos_a_total == 0 ? '0' : $plasticos_a_total,
            'Metales' => $metales_total == 0 ? '0' : $metales_total,
            'Vidrios' => $vidrios_total == 0 ? '0' : $vidrios_total,
            'No Aprovechables' => $na_np_total == 0 ? '0' : $na_np_total,
            'Total No Peligrosos' => $total_no_preligrosos == 0 ? '0' : $total_no_preligrosos,
            'Peligrosos Sólidos' => $na_ps_total == 0 ? '0' : $na_ps_total,
            'Peligrosos Líquidos' => $na_pl_total == 0 ? '0' : $na_pl_total,
            'Total Peligrosos' => $total_peligrosos == 0 ? '0' : $total_peligrosos,
            'TOTAL DE RESIDUOS' => $total_residuos_1 == 0 ? '0' : $total_residuos_1,
            'TOTAL RNPD' => $total_RNPD == 0 ? '0' : $total_RNPD,
            'TOTAL RNPI' => $total_RNPI == 0 ? '0' : $total_RNPI,
            'TOTAL RPS' => $total_RPS == 0 ? '0' : $total_RPS,
            'TOTAL RPL' => $total_RPL == 0 ? '0' : $total_RPL,
            'TOTAL RESIDUOS' => $total_residuos_2 == 0 ? '0' : $total_residuos_2
        ];
    }

    public function getReportArray($waste, array $headings_array)
    {
        $base_array = $this->initializeReportArray($headings_array);
        $report_header = $this->getReportHeader($waste);
        $report_body = $this->getReportBody($waste);

        // return $report_header;

        // // return array_merge($report_header, $report_body);

        return array_merge(array_merge($base_array, $report_header), $report_body);
    }
}
