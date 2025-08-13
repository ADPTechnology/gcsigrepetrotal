<?php

namespace App\Http\Controllers\Verificator;

use App\Exports\Verificator\GeneratedWastesVerificatorExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use DataTables;
use App\Models\{GuideWaste};
use Carbon\Carbon;

class VerificatorGeneratedWastesController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if($request->ajax())
        {
            $wastes = GuideWaste::whereHas('guide', function($query) use($user){
                                    $query->where('stat_approved', 1)
                                        ->where('stat_recieved', 1)
                                        ->where('stat_verified', 1)
                                        ->where('id_checker', $user->id);
                                })
                                ->with(['waste.classesWastes',
                                        'guide',
                                        'package',
                                        'packingGuide'
                                ])
                                ->select('guide_wastes.*');

            if ($request->filled('from_date') && $request->filled('end_date')) {

                $wastes = $wastes->whereHas('guide', function ($q) use ($request) {
                    $q->whereBetween('internment_guides.date_verified', [$request->from_date, $request->end_date]);
                });
            }

            $allWastes = DataTables::of($wastes)
                        ->editColumn('packing_guide.cod_guide', function($waste){
                            return $waste->packingGuide != null ? $waste->packingGuide->cod_guide : '- -';
                        })
                        ->addColumn('waste.classes_wastes', function($waste){
                            return $waste->waste->classesWastes->first()->symbol ?? '-';
                        })
                        ->editColumn('packing_guide.date_guides_departure', function($waste){
                            return $waste->packingGuide != null ? $waste->packingGuide->date_guides_departure : '- -';
                        })
                        ->editColumn('packing_guide.volum', function($waste){
                            return $waste->packingGuide != null ? $waste->packingGuide->volum : '- -';
                        })
                        ->make(true);

            return $allWastes;
        }

        return view('principal.viewVerificator.generatedWastes.index');
    }

    public function exportExcel(Request $request)
    {
        $date_info = $request->filled('from_date') &&
                    $request->filled('end_date') ?
                    $request->from_date.'_'.$request->end_date :
                    'todo';

        $file_name = 'residuos-generados_administrador-'. $request->user_name .'_'. $date_info .'_'. Carbon::now()->format('h-i-s') .'.xlsx';

        $from_date = $request->from_date ?? '';
        $end_date = $request->end_date ?? '';

        $user = Auth::user();

        $generatedWastesExport = new GeneratedWastesVerificatorExport($from_date, $end_date, $user);
        return $generatedWastesExport->download($file_name);
    }
}
