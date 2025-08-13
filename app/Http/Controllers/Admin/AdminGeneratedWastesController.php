<?php

namespace App\Http\Controllers\Admin;

use App\Exports\GeneratedWastesExport;
use App\Exports\GeneratedWastesGeneralExport;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Group;
use App\Models\GuideWaste;
use App\Models\Warehouse;
use App\Models\WasteType;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use App\Services\GeneratedWastesService;
use Carbon\Carbon;

class AdminGeneratedWastesController extends Controller
{
    private $generatedWastesService;

    public function __construct(GeneratedWastesService $service)
    {
        $this->generatedWastesService = $service;
    }

    public function index(Request $request)
    {
        if ($request->ajax()) {
            return $this->generatedWastesService->getDatatable($request);
        }

        $guideQuery = app(DashboardService::class)->internmentWastesQuery();

        $max_date = $guideQuery->selectRaw('MAX(internment_guides.created_at) AS max_date')->first()->max_date;
        $min_date = $guideQuery->selectRaw('MIN(internment_guides.created_at) AS min_date')->first()->min_date;


        // ->map(function ($row) {
        //                 return $row->code;
        //             });

        return view('principal.viewAdmin.generatedWastes.index', compact(
            'max_date',
            'min_date'
        ));
    }

    public function getTotalWeight(Request $request)
    {
        $query = $this->generatedWastesService->getQueryByFilters($request);
        $value = $query->sum('aprox_weight');

        return response()->json([
            'value' => round($value, 2)
        ]);
    }

    public function getFilters(Request $request)
    {
        if ($request->ajax()) {

            switch ($request['filter']) {
                case 'warehouse':
                    $query = Warehouse::query();
                    if ($request->filled('search')) {
                        $query->where('name', 'LIKE', '%' . $request['search'] . '%');
                    }
                    $data = $query->get(['id', 'name']);
                    break;
                case 'company':
                    $query = Company::query();
                    if ($request->filled('search')) {
                        $query->where('name', 'LIKE', '%' . $request['search'] . '%');
                    }
                    $data = $query->get(['id', 'name']);
                    break;
                case 'code':
                    $query = Warehouse::selectRaw('DISTINCT(code) AS code')
                        ->whereNotNull('code');
                    if ($request->filled('search')) {
                        $query->where('code', 'LIKE', '%' . $request['search'] . '%');
                    }
                    $data = $query->get()
                        ->map(function ($row) {
                            return [
                                'id' => $row->code,
                                'code' => $row->code
                            ];
                        });
                    break;
                case 'waste':
                    $query = WasteType::query();
                    if ($request->filled('search')) {
                        $query->where('name', 'LIKE', '%' . $request['search'] . '%');
                    }
                    $data = $query->get(['id', 'name']);
                    break;
                case 'group':
                    $query = Group::query();
                    if ($request->filled('search')) {
                        $query->where('name', 'LIKE', '%' . $request['search'] . '%');
                    }
                    $data = $query->get(['id', 'name']);
                    break;
                default:
                    $data = [];
            }

            return $data;
        };
    }

    public function exportExcel(Request $request)
    {
        $date_info = $request->filled('from_date') &&
            $request->filled('end_date') ?
            $request->from_date . '_' . $request->end_date :
            'todo';

        $file_name = 'internamiento_administrador-' . $request->user_name . '_' . $date_info . '_' . Carbon::now()->format('h-i-s') . '.xlsx';

        // $from_date = $request->from_date ?? '';
        // $end_date = $request->end_date ?? '';

        $generatedWastesExport = new GeneratedWastesExport($request);
        return $generatedWastesExport->download($file_name);
        // return back()->with('Se empezó a exportar el archivo.');
    }

    public function exportGeneralExcel(Request $request)
    {
        $date_info = $request->filled('from_date') &&
            $request->filled('end_date') ?
            $request->from_date . '_' . $request->end_date :
            'todo';

        $file_name = 'reporte-general-residuos-generados-' . $request->user_name .
            '_' . $date_info . '_' . Carbon::now()->format('h_i_s') . '.xlsx';

        $from_date = $request->from_date ?? '';
        $end_date = $request->end_date ?? '';

        $generatedWastesGeneralExport = new GeneratedWastesGeneralExport($from_date, $end_date);
        return $generatedWastesGeneralExport->download($file_name);
        // $generatedWastesGeneralExport->queue('exports/' . $file_name);
    }
}
