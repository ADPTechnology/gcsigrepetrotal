<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use DataTables;
use App\Models\{IntermentGuide, PackingGuide, GuideWaste, Disposition};

class DispositionController extends Controller
{
    public function index(Request $request)
    {
        if($request->ajax()){

            $dispositions = Disposition::select('dispositions.*')
                                    ->has('wastes')
                                    ->with([
                                        'firstWaste' => fn ($q) =>
                                            $q->select(['id','id_disposition','actual_weight', 'id_wasteType'])
                                            ->with('waste.classesWastes')
                                    ]);

            $allDispositions = DataTables::of($dispositions)
                ->addColumn('choose', function($disposition){
                    $checkbox = '<div class="custom-checkbox custom-control">
                                    <input type="checkbox" name="dispositions-selected[]"
                                    data-status-disposition="'.$disposition->status.'"
                                    class="custom-control-input" id="checkbox-'.$disposition->id.'" value="'.$disposition->id.'">
                                    <label for="checkbox-'.$disposition->id.'" class="custom-control-label checkbox-waste-label">&nbsp;</label>
                                </div>';
                    return $checkbox;
                })
                ->editColumn('code_green_care', function ($disposition) {
                    return '<a href="javascript:void(0);" class="btn-show-disposition"
                            data-url="'. route('getDispositionDetail.ajax', $disposition) .'">'.
                                $disposition->code_green_care ?? '-'
                            .'</a>';
                })
                ->addColumn('waste_class', function ($disposition) {
                    $wasteClass = '-';

                    if ($disposition->firstWaste) {
                        $wasteClass = $disposition->firstWaste->waste->classesWastes->first()->symbol ?? '-';
                    }

                    return $wasteClass;
                })
                ->addColumn('waste_type', function ($disposition) {
                    $wasteType = $disposition->firstWaste->waste->name ?? '-';
                    return $wasteType;
                })
                ->addColumn('total_weight', function ($disposition) {
                    return round($disposition->wastes->sum('actual_weight'), 2);
                })
                ->editColumn('code_dff', function ($disposition) {
                    return $disposition->code_dff ?? '-';
                })->editColumn('weigth', function ($disposition) {
                    return $disposition->weigth ?? '-';
                })->editColumn('weigth_diff', function ($disposition) {
                    return $disposition->weigth_diff ?? '-';
                })->editColumn('disposition_place', function ($disposition) {
                    return $disposition->disposition_place ?? '-';
                })->editColumn('code_invoice', function ($disposition) {
                    return $disposition->code_invoice ?? '-';
                })->editColumn('code_certification', function ($disposition) {
                    return $disposition->code_certification ?? '-';
                })->editColumn('plate', function ($disposition) {
                    return $disposition->plate ?? '-';
                })->editColumn('managment_report', function ($disposition) {
                    return $disposition->managment_report ?? '-';
                })->editColumn('observations', function ($disposition) {
                    return $disposition->observations ?? '-';
                })
                ->editColumn('date_dff', function ($disposition) {
                    return $disposition->date_dff ?? '-';
                })

                ->editColumn('status', function($disposition){
                    $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                    if($disposition->status == 1)
                    {
                        $status = '<span class="info-guide-checked">
                                        Gestionado
                                    </span>';
                    }
                    return $status;
                })
                ->rawColumns(['choose', 'code_green_care', 'status'])
                ->make(true);

            return $allDispositions;
        }

        $query = Disposition::has('wastes');

        $q1 = clone $query;
        $max_date = $q1 ->selectRaw('MAX(date_departure) AS max_date')->first()->max_date;
        $q2 = clone $query;
        $min_date = $q2->selectRaw('MIN(date_departure) AS min_date')->first()->min_date;

        $q3 = clone $query;
        $guideGcCollection = $q3->selectRaw('DISTINCT(code_green_care)')->get();
        $q4 = clone $query;
        $destinationCollection = $q4->selectRaw('DISTINCT(destination)')->get();
        $q5 = clone $query;
        $plateCollection = $q5->selectRaw('DISTINCT(plate_init)')->get();
        $q6 = clone $query;
        $wasteCollection = $q6->with([
                                'firstWaste' => fn ($q) =>
                                    $q->select(['id','id_disposition','actual_weight', 'id_wasteType'])
                                    ->with('waste')
                            ])->get()
                            ->map(function ($packingGuide) {
                                return $packingGuide->firstWaste->waste;
                            })->filter()->unique('id');

        return view('principal.viewManager.dispositions.index', compact(
            'max_date',
            'min_date',
            'guideGcCollection',
            'destinationCollection',
            'plateCollection',
            'wasteCollection'
        ));
    }

    public function getDispositions(Request $request)
    {
        // $wastes = GuideWaste::whereIn('id', $request['values'])
        //                     ->with(['waste.classesWastes',
        //                             'package',
        //                             'packingGuide',
        //                             'departure'
        //                     ])->get();

        $dispositions = Disposition::whereIn('id', $request['values'])
                                    ->get();

        $totalWeight = $dispositions->sum(function ($disposition) {
            return $disposition->weigth_init;
        });

        return response()->json([
            "dispositions" => $dispositions,
            "total_weight" => $totalWeight
        ]);
    }

    public function getDispositionDetail(Disposition $disposition)
    {
        $disposition->load([
                'wastes.guide.warehouse.company',
                'wastes.waste.classesWastes',
                'wastes.package',
                'wastes.packingGuide',
                'wastes.disposition'
            ]);

        $html = view('principal.viewManager.dispositions.partials.components._content_disposition_detail', compact(
                'disposition'
            ))->render();

        return response()->json([
            "html" => $html
        ]);
    }

    public function update(Request $request)
    {
        $dispositions = Disposition::whereIn('id', $request['disposition-ids'])->get();
        $statStore = false;

        foreach($dispositions as $disposition){
            if($disposition->status == 1){
                $statStore = true;
                break;
            }
        }

        if(!$statStore){

            foreach($dispositions as $disposition)
            {
                $disposition->update([
                    "status" => 1,

                    "code_dff" => $request['n-ddff-guide'],
                    "date_dff" => $request['date-ddff'],
                    "weigth" => $request['ddff-weight'],
                    "weigth_diff" => $request['weight-diff'],
                    "disposition_place" => $request['disposition-place'],
                    "code_invoice" => $request['n-invoice'],
                    "code_certification" => $request['n-certification'],
                    "plate" => $request['plate'],
                    "managment_report" => $request['report'],
                    "observations" => $request['observation'],
                ]);
            }
        }

        return response()->json([
            "success" => true
        ]);
    }
}
