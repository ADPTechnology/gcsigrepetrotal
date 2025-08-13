<?php

namespace App\Http\Controllers\Manager;

use App\Exports\Manager\{DeparturesWastesExport, InternmentWastesExport};
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Company, PackingGuide, GuideWaste, InterManagement, IntermentGuide, PackageType, WasteClass, WasteType};
use App\Services\StockWastesService;
use Auth;
use Carbon\Carbon;
use Exception;

class PackingGuideController extends Controller
{
    private $stockWastesService;

    public function __construct(StockWastesService $servcice)
    {
        $this->stockWastesService = $servcice;
    }

    public function index(Request $request)
    {
        if($request->ajax())
        {
            return $this->stockWastesService->getDatatable($request);
        }
        $request->session()->forget('stock_selected_ids');
        $session_stock_ids = $request->session()->get('stock_selected_ids', []);

        $request->session()->forget('pckguides_selected_ids');
        $session_pckguides_ids = $request->session()->get('pckguides_selected_ids', []);


        $companies = Company::get(['id', 'name']);
        // $package_types = PackageType::get(['id', 'name']);
        $waste_classes = WasteClass::get(['id', 'symbol']);

        $guideQuery = GuideWaste::join('internment_guides', 'guide_wastes.id_guide', '=', 'internment_guides.id')
                    ->has('guide')
                    ->where('gestion_type', 'INTERNA');
                                // ->where('internment_guides.stat_approved', 1)
                                // ->where('internment_guides.stat_recieved', 1)
                                // ->where('internment_guides.stat_verified', 1);

        $max_date_stock = $guideQuery->selectRaw('MAX(internment_guides.created_at) AS max_date')->first()->max_date;
        $min_date_stock = $guideQuery->selectRaw('MIN(internment_guides.created_at) AS min_date')->first()->min_date;

        $departureQuery = PackingGuide::query();

        $max_date_depart = $departureQuery->selectRaw('MAX(date_guides_departure) AS max_date')->first()->max_date;
        $min_date_depart = $departureQuery->selectRaw('MIN(date_guides_departure) AS min_date')->first()->min_date;

        $managements_types = InterManagement::all();

        return view('principal.viewManager.packingGuides.index', compact(
            'session_stock_ids',
            'session_pckguides_ids',
            'companies',
            'managements_types',
            // 'package_types',
            'waste_classes',
            'max_date_stock',
            'min_date_stock',
            'max_date_depart',
            'min_date_depart'
        ));
    }

    public function selectWasteStock(Request $request)
    {
        $ids = $request['selected'] ?? [];
        // $ids = $request->session()->get('stock_selected_ids', []);

        // $isChecked = $request->checked == 'true' ? true : false;
        // $valid = $request->status != '1' ? true: false;

        // if ($valid) {
        //     if ($isChecked) {
        //         if (($key = array_search($id, $ids)) == false) {
        //             $ids = array_merge($ids, [$id]);
        //         }
        //     }
        //     else {
        //         if (($key = array_search($id, $ids)) !== false) {
        //             unset($ids[$key]);
        //         }
        //     }
        // }
        $session_stock_ids = array_unique(array_values($ids));
        // $request->session()->forget('stock_selected_ids');
        $request->session()->put('stock_selected_ids', $session_stock_ids);

        $html_button = view('principal.viewManager.packingGuides.partials.components._button_stock', compact(
            'session_stock_ids'
        ))->render();

        return response()->json([
            'html_button' => $html_button
        ]);
    }

    public function selectPackingGuide(Request $request)
    {
        $ids = $request['selected'] ?? [];
        $session_pckguides_ids = array_unique(array_values($ids));
        $request->session()->put('pckguides_selected_ids', $ids);

        $html_button = view('principal.viewManager.packingGuides.partials.components._button_pckguide', compact(
            'session_pckguides_ids'
        ))->render();

        return response()->json([
            'html_button' => $html_button
        ]);
    }

    public function loadWasteTypes(Request $request)
    {
        $wastes_types = WasteType::whereHas('classesWastes', function ($q) use($request) {
                            $q->where('classes_has_wastes.id_class', $request['value']);
                        })->get(['id', 'name']);

        return response()->json([
            'wastes_types' => $wastes_types
        ]);
    }

    public function getWastesTotalWeight(Request $request)
    {
        $query = $this->stockWastesService->getQueryByFiltersTotal($request);
        $value = $query->sum('aprox_weight');

        return response()->json([
            'value' => round($value, 2)
        ]);
    }

    public function loadGuidesSelected(Request $request)
    {
        if($request['table'] == 'packingGuide')
        {
            $ids = $request->session()->get('stock_selected_ids', []);

            $wastes = GuideWaste::whereIn('id', $ids)
                                ->with(['waste.classesWastes',
                                        'guide',
                                        'guide.warehouse.company',
                                        'package',
                                        'packingGuide',
                                        'disposition'
                                ])->get();

            $weight = $wastes->sum(function($waste){
                                    return $waste->aprox_weight;
                                });

            // $packages = $wastes->sum(function($waste){
            //                         return $waste->package_quantity;
            //                     });


            $html_table = view('principal.viewManager.packingGuides.partials.components._wastes-register-pg-table', compact(
                'wastes'
            ))->render();

            return response()->json([
                "table" => $html_table,
                "weight" => round($weight, 2),
                // "packages" => $packages
            ]);
        }
        elseif($request['table'] == "departure")
        {
            $ids = $request->session()->get('pckguides_selected_ids', []);

            $guides = PackingGuide::whereIn('id', $ids)
                                    ->withSum('wastes', 'actual_weight')
                                    ->withSum('wastes', 'package_quantity')
                                    ->get();


            $table = view('principal.viewManager.packingGuides.partials.components._pg-update-table', compact(
                'guides'
            ))->render();

            return response()->json([
                "html" => $table
            ]);
        }
    }

    public function storePackageGuide(Request $request)
    {
        $statStore = false;
        $wastes = GuideWaste::whereIn('id', $request['guides-pg-ids'])->get();

        foreach($wastes as $waste){
            if($waste->stat_stock == 1){
                $statStore = true;
                break;
            }
        }

        $volum = is_numeric($request['volume']) ? $request['volume'] : null;

        if(!$statStore){

            $packingGuide = PackingGuide::create([
                "cod_guide" => $request['code'],
                "date_guides_departure" => $request['date'],
                "volum" =>  $volum,
                "inter_management_id" => $request['inter_management_id'],
                "comment" => $request['comment'],
                "status" => false
            ]);

            $wastes = GuideWaste::whereIn('id', $request['guides-pg-ids'])->get();

            foreach($wastes as $waste)
            {
                $waste->update([
                    "stat_stock" => 1,
                    "id_packing_guide" => $packingGuide->id,
                ]);
            }

            $request->session()->put('stock_selected_ids', []);
        }

        $html_button = view('principal.viewManager.packingGuides.partials.components._button_stock', [
            'session_stock_ids' => $request->session()->get('stock_selected_ids', [])
        ])->render();

        return response()->json([
            'html_button' => $html_button,
            "success" => "store successfully"
        ]);
    }

    public function loadInternmentGuideDetail(IntermentGuide $guide)
    {
        $guide->load([
            'warehouse' => fn ($q) =>
                $q->with([
                        'lot',
                        'company',
                        'location',
                        'projectArea'
                    ]),
            'guideWastes' => fn ($q) =>
                $q->with([
                    'waste.classesWastes.group',
                ]),
        ]);

        $html = view('principal.viewManager.packingGuides.partials.components._int-guide-tables', compact(
            'guide'
        ))->render();

        return response()->json([
            'html' => $html
        ]);
    }

    public function loadPackingGuideDetail(Request $request, PackingGuide $guide)
    {
        $guide = $guide->where('id', $guide->id)
                        ->with(['wastes.guide.warehouse.company',
                                'wastes.waste.classesWastes',
                                'wastes.package',
                                'wastes.packingGuide',
                                'wastes.disposition'
                        ])
                        ->withSum('wastes', 'actual_weight')
                        ->withSum('wastes', 'package_quantity')
                        ->first();
        $guides = [$guide];

        $html_pg = view('principal.viewManager.packingGuides.partials.components._pg-update-table', compact(
            'guides'
        ))->render();

        $wastes = $guide->wastes;
        $html_wastes = view('principal.viewManager.packingGuides.partials.components._pg_wastes_table', compact(
            'wastes'
        ))->render();

        return response()->json([
            "html_pg" => $html_pg,
            "html_wastes" => $html_wastes,
        ]);
    }

    public function getPartitionData(GuideWaste $waste)
    {
        $waste->load([
            'packingGuide',
            'guide.warehouse.company',
            'waste.classesWastes',
            'package'
        ]);

        try {

            $html = view('principal.viewManager.packingGuides.partials.components._waste-partition-table', compact(
                'waste'
            ))->render();

        } catch (Exception $e) {

        }

        return response()->json([
            "html" => $html ?? '',
            "waste" => $waste
        ]);
    }

    public function storeWastePartitions(Request $request, GuideWaste $waste)
    {
        try {
            $success = $this->stockWastesService->storeWastePartitions($waste, $request);
            $message = 'Registro actualizado exitosamente';
        } catch (Exception $e) {
            $message = 'Ocurrió un error inesperado'.
            $success = false;
        }

        return response()->json([
            "message" => $message,
            "success" => $success
        ]);
    }

    public function updateDeparturePg(Request $request)
    {
        $guides = PackingGuide::whereIn('id', $request['guides-departure-selected'])
                            ->update([
                                "date_departure" => $request['date'],
                                "shipping_type" => $request['transport-type'],
                                "destination" => $request['destination'],
                                "ppc_code" => $request['n-guideppc'],
                                "manifest_code" => $request['n-manifest'],

                                "status" => 1,
                            ]);

        $request->session()->put('pckguides_selected_ids', []);

        $html_button = view('principal.viewManager.packingGuides.partials.components._button_pckguide', [
            'session_pckguides_ids' => $request->session()->get('pckguides_selected_ids', [])
        ])->render();

        return response()->json([
            "html_button" => $html_button,
            "success" => "updated successfully"
        ]);
    }

    public function editDeparturePg(PackingGuide $guide)
    {
        $guide->load(['wastes.guide.warehouse.company',
                    'wastes.waste.classesWastes',
                    'wastes.package',
                    'wastes.packingGuide',
                    'wastes.disposition'
            ])
            ->loadSum('wastes', 'actual_weight')
            ->loadSum('wastes', 'package_quantity');

        $guides = [$guide];

        $html = view('principal.viewManager.packingGuides.partials.components._form_pg_wastes', compact(
            'guides',
            'guide'
        ))->render();

        return response()->json([
            'html' => $html,
            'guide' => $guide
        ]);
    }

    public function editUpdatePackingGuide(Request $request, PackingGuide $guide)
    {
        $success = false;

        if ($guide->status == 1) {
            $guide->update([
                'manifest_code' => $request->manifest_code
            ]);

            $success = true;
        }

        $message = getMessageFromSuccess($success, 'updated');

        return response()->json([
            'success' => $success,
            'message' => $message
        ]);
    }


    public function exportWastesExcel(Request $request)
    {
        $date_info = $request->filled('from_date') &&
                    $request->filled('end_date') ?
                    $request->from_date.'_'.$request->end_date :
                    'Todo';

        $file_name = 'detalle-residuos-verificados_gestor-'. Auth::user()->name .'_'. $date_info .'_'. Carbon::now()->format('h_i_s') . '.xlsx';

        $from_date = $request->from_date ?? '';
        $end_date = $request->end_date ?? '';
        $status = $request->status ?? '';

        $internmentWastesExport = new InternmentWastesExport($from_date, $end_date, $status);

        return $internmentWastesExport->download($file_name);
    }

    public function exportWastesDeparturesExcel(Request $request)
    {
        $date_info = $request->filled('from_date') &&
                    $request->filled('end_date') ?
                    $request->from_date.'_'.$request->end_date :
                    'Todo';

        $file_name = 'detalle-carga_gestor-'. Auth::user()->name .'_'. $date_info .'_'. Carbon::now()->format('h_i_s') . '.xlsx';

        $from_date = $request->from_date ?? '';
        $end_date = $request->end_date ?? '';
        $status = $request->status ?? '';

        $departuresWastesExport = new DeparturesWastesExport($from_date, $end_date, $status);

        return $departuresWastesExport->download($file_name);
    }
}
