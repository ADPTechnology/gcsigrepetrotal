<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{
    GuideWaste
};
use Auth;
use DataTables;

class ApplicantGeneratedWastesController extends Controller
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
                                            ->where('id_applicant', $user->id);
                                    })
                                    ->with([
                                        'waste.classesWastes',
                                        'guide' => fn ($q) =>
                                            $q->with(['warehouse' => fn ($q) =>
                                                        $q->with([
                                                                'company',
                                                                'front',
                                                                'location',
                                                                'lot',
                                                                'projectArea',
                                                                'stage'
                                                        ])
                                        ]),
                                        'package',
                                        'packingGuide',
                                        'disposition'
                                    ]);

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


                        ->editColumn('disposition.code_green_care', function ($waste) {
                            return $waste->disposition->code_green_care ?? '-';
                        })
                        ->editColumn('disposition.destination', function ($waste) {
                            return $waste->disposition->destination ?? '-';
                        })
                        ->editColumn('disposition.plate_init', function ($waste) {
                            return $waste->disposition->plate_init ?? '-';
                        })
                        ->editColumn('disposition.weigth_init', function ($waste) {
                            return $waste->disposition->weigth_init ?? '-';
                        })
                        ->editColumn('disposition.date_departure', function ($waste) {
                            return $waste->disposition->date_departure ?? '-';
                        })
                        ->editColumn('disposition.code_dff', function ($waste) {
                            return $waste->disposition->code_dff ?? '-';
                        })
                        ->editColumn('disposition.weigth', function ($waste) {
                            return $waste->disposition->weigth ?? '-';
                        })
                        ->editColumn('disposition.weigth_diff', function ($waste) {
                            return $waste->disposition->weigth_diff ?? '-';
                        })
                        ->editColumn('disposition.disposition_place', function ($waste) {
                            return $waste->disposition->disposition_place ?? '-';
                        })
                        ->editColumn('disposition.code_invoice', function ($waste) {
                            return $waste->disposition->code_invoice ?? '-';
                        })
                        ->editColumn('disposition.code_certification', function ($waste) {
                            return $waste->disposition->code_certification ?? '-';
                        })
                        ->editColumn('disposition.plate', function ($waste) {
                            return $waste->disposition->plate ?? '-';
                        })
                        ->editColumn('disposition.managment_report', function ($waste) {
                            return $waste->disposition->managment_report ?? '-';
                        })
                        ->editColumn('disposition.observations', function ($waste) {
                            return $waste->disposition->observations ?? '-';
                        })
                        ->editColumn('disposition.date_dff', function ($waste) {
                            return $waste->disposition->date_dff ?? '-';
                        })
                        ->editColumn('disposition.status', function ($waste) {

                            $status = '<span class="info-guide-pending">
                                        Pendiente
                                    </span>';

                            if($waste->disposition->status ?? 0 == 1)
                            {
                                $status = '<span class="info-guide-checked">
                                                Gestionado
                                            </span>';
                            }
                            return $status;
                        })
                        ->rawColumns(['disposition.status'])
                        ->make(true);

            return $allWastes;
        }

        return view('principal.viewApplicant.generatedWastes.index');
    }
}
