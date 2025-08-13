<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DataTables;
use App\Models\{Departure, Disposition, GuideWaste, PackingGuide};
use Exception;

class DepartureController extends Controller
{
    public function index(Request $request)
    {
        if($request->ajax()){

            // $wastes = GuideWaste::whereHas('guide', function($query){
            //                         $query->where('stat_approved', 1)
            //                                 ->where('stat_recieved', 1)
            //                                 ->where('stat_verified', 1);
            //                         })
            //                         ->where('stat_departure', 1)
            //                         ->with(['waste.classesWastes',
            //                                 'guide',
            //                                 'guide.warehouse.company',
            //                                 'package',
            //                                 'packingGuide',
            //                                 'departure'
            //                         ]);

            $departures = PackingGuide::select('packing_guides.*')
                                    ->where('status', 1)
                                    ->where('ppc_code', '!=', null)
                                    ->with([
                                        'firstWaste' => fn ($q) =>
                                            $q->select(['id','id_packing_guide','actual_weight', 'id_wasteType'])
                                            ->with('waste.classesWastes')
                                    ]);

            $allDepartures = DataTables::of($departures)
                        ->addColumn('choose', function($departure){
                            $checkbox = '<div class="custom-checkbox custom-control">
                                            <input type="checkbox" name="departures-selected[]"
                                             data-status-arrival="'.$departure->stat_arrival.'"
                                             data-status-departure="'.$departure->stat_transport_departure.'"
                                             class="custom-control-input" id="checkbox-'.$departure->id.'" value="'.$departure->id.'">
                                            <label for="checkbox-'.$departure->id.'" class="custom-control-label checkbox-waste-label">&nbsp;</label>
                                        </div>';
                            return $checkbox;
                        })
                        ->editColumn('cod_guide', function($packingGuide){

                            $link = '<a href="" class="btn-show-packingGuide"
                                        data-url="'.route('loadPackingGuideDetail.manager', ["guide" => $packingGuide] ).'">'.
                                            $packingGuide->cod_guide
                                    .'</a>';

                            return $link;
                        })
                        ->addColumn('waste_class', function ($packingGuide) {
                            $wasteClass = '-';

                            if ($packingGuide->firstWaste) {
                                $wasteClass = $packingGuide->firstWaste->waste->classesWastes->first()->symbol ?? '-';
                            }

                            return $wasteClass;
                        })
                        ->addColumn('waste_type', function ($packingGuide) {
                            $wasteType = $packingGuide->firstWaste->waste->name ?? '-';
                            return $wasteType;
                        })
                        ->addColumn('total_weight', function($departure){
                            return round($departure->wastes->sum('actual_weight'), 2);
                        })
                        ->editColumn('gc_code', function ($departure) {
                            return $departure->gc_code ?? '-';
                        })
                        ->editColumn('date_arrival', function ($departure) {
                            return $departure->date_arrival ?? '-';
                        })
                        ->editColumn('date_retirement', function ($departure) {
                            return $departure->date_retirement ?? '-';
                        })
                        ->editColumn('status', function($departure) {
                            $status = '<span class="info-guide-pending">
                                            Pendiente
                                        </span>';
                            if($departure->status == 1)
                            {
                                $status = '<span class="info-guide-checked">
                                                Gestionado
                                            </span>';
                            }
                            return $status;
                        })
                        ->editColumn('stat_arrival', function($departure){
                            $status = '<span class="info-guide-pending">
                                            Pendiente
                                        </span>';
                            if($departure->stat_arrival == 1)
                            {
                                $status = '<span class="info-guide-checked">
                                                Gestionado
                                            </span>';
                            }
                            return $status;
                        })
                        // ->addColumn('stat_disposition', function ($departure) {

                        //     if ($departure->wastes_count == $departure->wastes_disposition_count) {
                        //         $status = '<span class="info-guide-checked">
                        //                         Gestionado
                        //                     </span>';
                        //     }
                        //     else {
                        //         $status = '<span class="info-guide-pending">
                        //                     Pendiente
                        //                 </span>';
                        //     }
                        //     return $status;
                        // })
                        // ->editColumn('stat_transport_departure', function($departure){
                        //     $status = '<span class="info-guide-pending">
                        //                     Pendiente
                        //                 </span>';
                        //     if($departure->stat_transport_departure == 1)
                        //     {
                        //         $status = '<span class="info-guide-checked">
                        //                         Gestionado
                        //                     </span>';
                        //     }
                        //     return $status;
                        // })
                        ->rawColumns(['choose', 'cod_guide', 'status', 'stat_arrival'])
                        ->make(true);

            return $allDepartures;
        }

        $query = PackingGuide::where('status', 1)
                            ->where('ppc_code', '!=', null);

        $q1 = clone $query;
        $max_date = $q1->selectRaw('MAX(date_departure) AS max_date')->first()->max_date;
        $q2 = clone $query;
        $min_date = $q2->selectRaw('MIN(date_departure) AS min_date')->first()->min_date;

        $q3 = clone $query;
        $ppc_collect = $q3->selectRaw('DISTINCT(ppc_code)')->get();
        $q4 = clone $query;
        $manifestCollect = $q4->selectRaw('DISTINCT(manifest_code)')->get();
        $q5 = clone $query;
        $wasteDepartureCollect = $q5->selectRaw('DISTINCT(cod_guide)')->get();
        $q6 = clone $query;
        $shippingCollect = $q6->selectRaw('DISTINCT(shipping_type)')->get();
        $q7 = clone $query;
        $destinationCollect = $q7->selectRaw('DISTINCT(destination)')->get();
        $q8 = clone $query;
        $guideGcCollect = $q8->selectRaw('DISTINCT(gc_code)')->get();
        $q9 = clone $query;
        $wastesCollect = $q9->has('firstWaste')
                            ->with([
                                'firstWaste' => fn ($q) =>
                                    $q->select(['id','id_packing_guide','actual_weight', 'id_wasteType'])
                                    ->with('waste')
                            ])->get()
                            ->map(function ($packingGuide) {
                                return $packingGuide->firstWaste->waste;
                            })->filter()->unique('id');

        return view('principal.viewManager.departures.index', compact(
            'max_date',
            'min_date',
            'ppc_collect',
            'manifestCollect',
            'wasteDepartureCollect',
            'shippingCollect',
            'destinationCollect',
            'guideGcCollect',
            'wastesCollect'
        ));
    }

    public function getWastesDeparturesDetail(Request $request)
    {
        $packingGuides = PackingGuide::whereIn('id', $request['values'])
                            ->with([
                                'wastes.guide.warehouse.company',
                                'wastes.waste.classesWastes',
                                'wastes.package'
                            ])
                            ->get();

        $html = view('principal.viewManager.departures.partials.components._content_form_disposition_register', compact(
                        'packingGuides'
                    ))->render();


        return response()->json([
            "html" => $html
        ]);
    }

    public function getDeparturesDetails(Request $request)
    {
        $departures = PackingGuide::whereIn('id', $request['values'])
                        ->withSum('wastes', 'actual_weight')
                        ->withSum('wastes', 'package_quantity')
                    ->get();

        $html = view('principal.viewManager.departures.partials.components._departure_pg_data', compact(
            'departures'
        ))->render();

        return response()->json([
            "html" => $html
        ]);
    }


    // public function getDepartureDetails(Departure $departure)
    // {
    //     $departure->loadSum('wastes', 'actual_weight')
    //             ->loadSum('wastes', 'package_quantity')
    //             ->loadSum('packingGuides', 'volum')
    //             ->load([
    //                 'packingGuides' => fn ($q) => $q
    //                     ->withSum('wastes', 'actual_weight')
    //                     ->withSum('wastes', 'package_quantity')
    //             ]);

    //     $html = view('principal.viewManager.departures.partials.components._content_departure_detail', compact(
    //                 'departure'
    //             ))->render();

    //     return response()->json([
    //         "html" => $html
    //     ]);
    // }


    public function updateWastesArrival(Request $request)
    {
        $departures = PackingGuide::whereIn('id', $request['departures-arrival-ids'])->get();

        foreach($departures as $departure)
        {
            if($departure->stat_arrival == 0){
                $departure->update([
                    "stat_arrival" => 1,
                    "date_arrival" => $request['date-arrival'],
                    "date_retirement" => $request['date-retreat'],
                    "gc_code" => $request['n-guide-gc']
                ]);
            }
        }

        return response()->json([
            "success" => true
        ]);
    }


    public function updateWastesDeparture(Request $request)
    {
        $wastes = GuideWaste::whereIn('id', $request['wastes-disposition-selected'])->get();

        $statStore = false;

        foreach($wastes as $waste){
            if($waste->stat_transport_departure == 1){
                $statStore = true;
                break;
            }
        }

        if(!$statStore){

            $disposition = Disposition::create([
                "code_green_care" => $request['n-green-care-guide'],
                "date_departure" => $request['date-departure'],
                "destination" => $request['destination'],
                "plate_init" => $request['plate'],
                "weigth_init" => $request['retrieved-weight'],
                "weigth_diff_init" => null
            ]);

            foreach($wastes as $waste)
            {
                $waste->update([
                    "stat_transport_departure" => 1,
                    "id_disposition" => $disposition->id
                ]);
            }
        }

        return response()->json([
            "success" => true
        ]);
    }
}
