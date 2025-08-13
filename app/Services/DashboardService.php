<?php

namespace App\Services;

use App\Models\GuideWaste;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;

class DashboardService
{
    public function getDashboardData(Request $request, string $location)
    {
        $data = [];

        $type = $request->type ?? 'all';
        $carbon_end_day = null;

        if ($location == 'INTER') {
            $main_query = $this->getInterDashboardQuery();
            $date_string = 'internment_guides.created_at';
        } else if ($location == 'INTMANAGEMENT') {
            $main_query = $this->getInterManagementDashboardQuery();
            $date_string = 'packing_guides.date_guides_departure';
        }

        if (!isset($main_query)) return;

        if ($request->filled('min_date') && $request->filled('max_date')) {

            $carbon_end_day = Carbon::parse($request['max_date']);
            $endDay = (clone $carbon_end_day)->endOfDay();
            $startDay = Carbon::parse($request['min_date'])->startOfDay();

            $main_query->whereBetween($date_string, [$startDay, $endDay]);
        }

        if ($request->filled('lots')) {
            $main_query->whereIn('lots.id', $request->lots);
        }

        // if ($request->filled('stages')) {
        //     $main_query->whereIn('stages.id', $request->stages);
        // }

        if ($request->filled('locations')) {
            $main_query->whereIn('locations.id', $request->locations);
        }

        if ($request->filled('projects')) {
            $main_query->whereIn('project_areas.id', $request->projects);
        }

        if ($request->filled('companies')) {
            $main_query->whereIn('companies.id', $request->companies);
        }

        // if ($request->filled('fronts')) {
        //     $main_query->whereIn('fronts.id', $request->fronts);
        // }

        if ($request->filled('groups')) {

            $main_query->whereIn('groups.id', $request->groups);

            // $class_symbols = [];

            // foreach ($request->classTypes as $type) {
            //     if (array_key_exists($type, $symbol_map)) {
            //         $class_symbols = array_merge($class_symbols, $symbol_map[$type]);
            //     }
            // }

            // $main_query->whereIn('waste_classes.symbol', $class_symbols);
        }

        if ($request->filled('classes')) {
            $main_query->whereIn('waste_classes.id', $request->classes);
        }

        if ($request->filled('wasteTypes')) {
            $main_query->whereIn('waste_types.id', $request->wasteTypes);
        }


        // * ------------ 0 GRÁFICO ------------

        if (in_array($type, ['0', 'all'])) {

            if ($carbon_end_day) {
                $limit_low = (clone $carbon_end_day)->startOfDay()->subDays(300);
                $query_0 = clone $main_query;

                $query_0->whereBetween($date_string, [$limit_low, $endDay])
                    ->selectRaw("DATE($date_string) AS date, SUM(guide_wastes.aprox_weight) AS cantidad")
                    ->groupByRaw("DATE($date_string)")
                    ->orderByRaw("DATE($date_string)");

                $results_0 = $query_0->get();

                $data_0 = $results_0->map(function ($i) {
                    $carbon_date = Carbon::parse($i->date);
                    $day = $carbon_date->day;
                    $month = config('parameters.month_abv_es')[$carbon_date->month];
                    return [
                        'date' => "$day-$month",
                        'amount' => round($i->cantidad / 1000, 2)
                    ];
                });
            }

            $data['data_0'] = $data_0 ?? [];
        }

        // *------------ 1 GRÁFICO -----------

        if (in_array($type, ["1", 'all'])) {

            $query_1 = clone $main_query;
            $query_1->selectRaw('MONTH(internment_guides.created_at) as mes, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('MONTH(internment_guides.created_at)')
                ->orderByRaw('MONTH(internment_guides.created_at)');

            $results_1 =  $query_1->get();

            $data_1 = $results_1->map(function ($i) {
                return [
                    'month' => config('parameters.months_n_es')[$i->mes],
                    'amount' => round($i->cantidad / 1000, 2)
                ];
            });

            $data['data_1'] = $data_1;
        }


        // -----------------------------------------------------

        // *------------ 2 GRÁFICO -----------

        if (in_array($type, ["2", 'all'])) {

            $query_2 = clone $main_query;
            $query_2->selectRaw('lots.name AS lote, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('lots.id, lots.name')
                ->orderByRaw('lots.name');

            $results_2 = $query_2->get();

            $data_2 = $results_2->map(function ($i) {
                return [
                    'lote' => $i->lote,
                    'amount' => round($i->cantidad)
                ];
            });

            $data['data_2'] = $data_2;
        }

        // -----------------------------------------------------

        // *------------ 3 GRÁFICO -----------

        // if (in_array($type, ["3", 'all'])) {

        //     $query_3 = clone $main_query;

        //     $query_3->selectRaw('stages.name AS stage, SUM(guide_wastes.aprox_weight) AS cantidad')
        //         ->groupByRaw('stages.id, stages.name')
        //         ->orderByRaw('stages.name');

        //     $results_3 = $query_3->get();

        //     $data_3 = $results_3->map(function ($i) {
        //         return [
        //             'stage' => $i->stage,
        //             'amount' => round($i->cantidad / 1000, 2)
        //         ];
        //     });

        //     $data['data_3'] = $data_3;
        // }

        // -----------------------------------------------------

        // *------------ 4 GRÁFICO -----------

        if (in_array($type, ["4", 'all'])) {

            $query_4 = clone $main_query;

            $query_4->selectRaw('project_areas.name AS project, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('project_areas.id, project_areas.name')
                ->orderByRaw('project_areas.name');

            $results_4 = $query_4->get();

            $data_4 = $results_4->map(function ($i) {
                return [
                    'project' => $i->project,
                    'amount' => round($i->cantidad)
                ];
            });

            $data['data_4'] = $data_4;
        }

        // -----------------------------------------------------

        // *------------ 5 GRÁFICO -----------

        if (in_array($type, ["5", 'all'])) {

            $query_5 = clone $main_query;

            $query_5->selectRaw('companies.name AS company, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('companies.id, companies.name')
                ->orderByRaw('companies.name');

            $results_5 = $query_5->get();

            $data_5 = $results_5->map(function ($i) {
                return [
                    'company' => $i->company,
                    'amount' => round($i->cantidad)
                ];
            });

            $data['data_5'] = $data_5;
        }

        // -----------------------------------------------------

        // *------------ 6 GRÁFICO -----------

        if (in_array($type, ["6", 'all'])) {

            $query_6 = clone $main_query;

            if ($request->filled('type_class_date')) {
                $tc_date = Carbon::parse($request->type_class_date);
                $tc_year = $tc_date->year;
                $tc_month = $tc_date->month;

                $query_6->whereYear('internment_guides.created_at', $tc_year)
                    ->whereMonth('internment_guides.created_at', $tc_month);
            }

            $query_6->selectRaw('groups.name AS name, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('groups.id, groups.name')
                ->orderByRaw('groups.name');

            $results_6 = $query_6->get();

            $data_6 = $results_6->map(function ($i) {
                return [
                    'group' => $i->name,
                    'amount' => round($i->cantidad / 1000, 2)
                ];
            });

            // $grouped_data = collect($data_6)->mapToGroups(function ($item) use ($symbol_map) {
            //     foreach ($symbol_map as $symbol => $classes) {
            //         if (in_array($item['class'], $classes)) {
            //             return [$symbol => $item['amount']];
            //         }
            //     }
            //     return [];
            // })
            //     ->map(function ($amounts, $symbol) {
            //         return [
            //             'symbol' => $symbol,
            //             'amount' => round($amounts->sum() / 1000, 2)
            //         ];
            //     })
            //     ->values()
            //     ->sortBy('symbol')
            //     ->values();

            $data['data_6'] = $data_6;
        }

        // -----------------------------------------------------

        // *------------ 7 GRÁFICO -----------

        if (in_array($type, ["7", 'all'])) {

            $query_7 = clone $main_query;

            $query_7->selectRaw('waste_types.name AS waste, SUM(guide_wastes.aprox_weight) AS cantidad')
                ->groupByRaw('waste_types.id, waste_types.name')
                ->orderByRaw('waste_types.name');

            $results_7 = $query_7->get();

            $data_7 = $results_7->map(function ($i) {
                return [
                    'waste' => $i->waste,
                    'amount' => round($i->cantidad)
                ];
            });

            $data['data_7'] = $data_7;
        }

        // -----------------------------------------------------

        // *------------ TOTALIZADOR -----------

        if (in_array($type, ["8", 'all'])) {

            $query_8 = clone $main_query;

            $query_8->selectRaw('SUM(guide_wastes.aprox_weight) AS total');
            $results_8 = $query_8->first();

            $data['totalizer'] = round($results_8->total / 1000, 2);
        }

        $data['wastes'] = (clone $main_query)->get();

        // -----------------------------------------------------

        return response()->json($data);
    }

    public function getDashBoardInitialData($base_query, ?string $location = null)
    {
        if ($location == 'INTER') {
            $min_date = (clone $base_query)
                ->selectRaw('MIN(internment_guides.created_at) AS min_date')
                ->first()->min_date;

            $max_date = (clone $base_query)
                ->selectRaw('MAX(internment_guides.created_at) AS max_date')
                ->first()->max_date;
        } else if ($location == 'INTMANAGEMENT') {
            $min_date = (clone $base_query)
                ->selectRaw('MIN(packing_guides.date_guides_departure) AS min_date')
                ->first()->min_date;

            $max_date = (clone $base_query)
                ->selectRaw('MAX(packing_guides.date_guides_departure) AS max_date')
                ->first()->max_date;
        }

        $lots = (clone $base_query)
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('lots', 'lots.id', '=', 'warehouses.id_lot')
            ->selectRaw('DISTINCT lots.id, lots.name')
            ->orderByRaw('lots.name')
            ->get();

        $locations = (clone $base_query)
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('locations', 'locations.id', '=', 'warehouses.id_location')
            ->selectRaw('DISTINCT locations.id, locations.name')
            ->orderByRaw('locations.name')
            ->get();

        $projects = (clone $base_query)
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('project_areas', 'project_areas.id', '=', 'warehouses.id_project_area')
            ->selectRaw('DISTINCT project_areas.id, project_areas.name')
            ->orderByRaw('project_areas.name')
            ->get();

        $companies = (clone $base_query)
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('companies', 'companies.id', '=', 'warehouses.id_company')
            ->selectRaw('DISTINCT companies.id, companies.name')
            ->orderByRaw('companies.name')
            ->get();


        $classes = (clone $base_query)
            ->join('classes_has_wastes', 'guide_wastes.id_wasteType', '=', 'classes_has_wastes.id_waste')
            ->join('waste_classes', 'waste_classes.id', '=', 'classes_has_wastes.id_class')
            ->selectRaw('DISTINCT waste_classes.id, waste_classes.symbol')
            ->orderByRaw('waste_classes.symbol')
            ->get();

        $wasteTypes = (clone $base_query)
            ->join('waste_types', 'guide_wastes.id_wasteType', '=', 'waste_types.id')
            ->selectRaw('DISTINCT waste_types.id, waste_types.name')
            ->orderByRaw('waste_types.name')
            ->get();

        $groups = (clone $base_query)
            ->join('classes_has_wastes', 'guide_wastes.id_wasteType', '=', 'classes_has_wastes.id_waste')
            ->join('waste_classes', 'waste_classes.id', '=', 'classes_has_wastes.id_class')
            ->join('groups', 'groups.id', '=', 'waste_classes.group_id')
            ->selectRaw('DISTINCT groups.id, groups.name')
            ->orderByRaw('groups.name')
            ->get();


        return [
            $min_date  ?? null,
            $max_date ?? null,
            $lots,
            $locations,
            $projects,
            $companies,
            $classes,
            $wasteTypes,
            $groups
        ];
    }

    // *  INTERNAMIENTO

    public function getInterDashboardQuery()
    {
        $main_query = $this->internmentWastesQuery()
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('lots', 'lots.id', '=', 'warehouses.id_lot')
            ->join('locations', 'locations.id', '=', 'warehouses.id_location')
            ->join('project_areas', 'project_areas.id', '=', 'warehouses.id_project_area')
            ->join('companies', 'companies.id', '=', 'warehouses.id_company')
            ->join('classes_has_wastes', 'guide_wastes.id_wasteType', '=', 'classes_has_wastes.id_waste')
            ->join('waste_classes', 'waste_classes.id', '=', 'classes_has_wastes.id_class')
            ->join('groups', 'groups.id', '=', 'waste_classes.group_id')
            ->join('waste_types', 'guide_wastes.id_wasteType', '=', 'waste_types.id');

        return $main_query;
    }

    public function internmentWastesQuery()
    {
        // return GuideWaste::join('internment_guides', 'guide_wastes.id_guide', '=', 'internment_guides.id')
        //     ->where('internment_guides.stat_approved', 1)
        //     ->where('internment_guides.stat_recieved', 1)
        //     ->where('internment_guides.stat_verified', 1)
        //     ->whereNotNull('internment_guides.created_at');

        return GuideWaste::join('internment_guides', 'guide_wastes.id_guide', '=', 'internment_guides.id')
            ->has('guide')
            ->whereNotNull('gestion_type');
    }


    // *  GESTIÓN INTERNA

    public function getInterManagementDashboardQuery()
    {
        $main_query = $this->getInterManagementQuery()
            ->join('warehouses', 'warehouses.id', '=', 'internment_guides.id_warehouse')
            ->join('lots', 'lots.id', '=', 'warehouses.id_lot')
            ->join('locations', 'locations.id', '=', 'warehouses.id_location')
            ->join('project_areas', 'project_areas.id', '=', 'warehouses.id_project_area')
            ->join('companies', 'companies.id', '=', 'warehouses.id_company')
            ->join('classes_has_wastes', 'guide_wastes.id_wasteType', '=', 'classes_has_wastes.id_waste')
            ->join('waste_classes', 'waste_classes.id', '=', 'classes_has_wastes.id_class')
            ->join('groups', 'groups.id', '=', 'waste_classes.group_id')
            ->join('waste_types', 'guide_wastes.id_wasteType', '=', 'waste_types.id');
        // ->join('packing_guides', 'packing_guides.id', '=', 'guide_wastes.id_packing_guide');

        return $main_query;
    }

    public function getInterManagementQuery()
    {
        return GuideWaste::join('internment_guides', 'guide_wastes.id_guide', '=', 'internment_guides.id')
            ->join('packing_guides', 'packing_guides.id', '=', 'guide_wastes.id_packing_guide')
            ->has('guide')
            ->has('packingGuide')
            ->where('gestion_type', 'INTERNA')
            ->where('stat_stock', 1);
    }
}
