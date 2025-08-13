<?php

namespace App\Services;

use App\Models\{Disposition, PackingGuide, GuideWaste};
use Illuminate\Http\Request;
use DataTables;
use Carbon\Carbon;

class StockWastesService
{
    public function getDatatable(Request $request)
    {
        if ($request['table'] == 'intGuide') {

            $wastes = $this->getQueryFilters('intGuide', $request);
            $selected_stock_ids = $request->session()->get('stock_selected_ids', []);

            $allWastes = DataTables::of($wastes)
                // ->addColumn('choose', function ($waste) use ($selected_stock_ids) {
                //     $is_checked = in_array($waste->id, $selected_stock_ids) ? 'checked' : '';

                //     if ($waste->stat_stock == 0) {
                //         $btn = '<div class="custom-checkbox custom-control">
                //                             <input type="checkbox" name="guides-selected[]"' . $is_checked . '
                //                             data-url="' . route('selectWasteStock.manager', ['id' => $waste->id]) . '"
                //                             data-status="' . $waste->stat_stock . '" class="custom-control-input" id="checkbox-' . $waste->id . '" value="' . $waste->id . '">
                //                             <label for="checkbox-' . $waste->id . '" class="custom-control-label checkbox-guide-label">&nbsp;</label>
                //                         </div>';
                //     } else {
                //         $btn = '<div class="custom-checkbox custom-control">
                //                             <input type="checkbox" name="guides-selected[]" disabled
                //                             data-status="' . $waste->stat_stock . '" class="custom-control-input" id="checkbox-' . $waste->id . '" value="' . $waste->id . '">
                //                             <label for="checkbox-' . $waste->id . '" class="custom-control-label">&nbsp;</label>
                //                         </div>';
                //     }

                //     $checkbox = $btn;

                //     return $checkbox;
                // })
                ->editColumn('guide.code', function ($waste) {
                    $guide = $waste->guide;
                    return '<a href="" class="btn-show-internmentGuide" data-url="' . route('loadInternmentGuide.manager', $guide) . '">' . $guide->code . '</a>';
                })
                ->editColumn('guide.created_at', function ($waste) {
                    // return Carbon::parse($waste->guide->created_at)->toDatetimeString();
                    return getOnlyDate($waste->guide->created_at);
                })
                ->addColumn('waste.classes_wastes.symbol', function ($waste) {
                    return $waste->waste->classesWastes->first()->symbol ?? '-';
                })
                ->addColumn('waste.classes_wastes.group.name', function ($waste) {
                    return $waste->waste->classesWastes->first()->group->name ?? '-';
                })
                ->editColumn('stat_stock_bool', function ($waste) {
                    return $waste->stat_stock;
                })
                ->editColumn('stat_stock', function ($waste) {
                    $status = '<span class="info-guide-pending">
                                            Pendiente
                                        </span>';
                    if ($waste->stat_stock == 1) {
                        $status = '<span class="info-guide-checked">
                                                Gestionado
                                            </span>';
                    }
                    return $status;
                })
                ->addColumn('action', function ($waste) {

                    $btn = '';

                    // if ($waste->stat_stock == 1) {

                    $btn .= '<button data-toggle="modal" data-id="' .
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
                    // }


                    return $btn;
                })
                ->rawColumns(['guide.code', 'partitions', 'partition_number', 'stat_stock', 'action'])
                ->make(true);

            return $allWastes;
        } elseif ($request['table'] == 'packing') {

            $packingGuides = $this->getQueryFilters('packing', $request);

            $allPackingGuides = DataTables::of($packingGuides)
                // ->addColumn('choose', function ($packingGuide) {
                //     $checkbox = '<div class="custom-checkbox custom-control">
                //                             <input type="checkbox" name="packingGuides-selected[]"  data-status="' . $packingGuide->status . '" class="custom-control-input" id="packingCheckbox-' . $packingGuide->id . '" value="' . $packingGuide->id . '">
                //                             <label for="packingCheckbox-' . $packingGuide->id . '" class="custom-control-label checkbox-packingGuide-label">&nbsp;</label>
                //                         </div>';
                //     return $checkbox;
                // })
                ->editColumn('cod_guide', function ($packingGuide) {
                    $link = '<a href="" class="btn-show-packingGuide" data-url="' . route('loadPackingGuideDetail.manager', ["guide" => $packingGuide]) . '">' . $packingGuide->cod_guide . '</a>';
                    return $link;
                })
                ->addColumn('first_waste.waste.classes_wastes.group.name', function ($packingGuide) {
                    return $packingGuide->firstWaste->waste->classesWastes->first()->group->name ?? '-';
                })
                // ->editColumn('total_weigth', function ($packingGuide) {
                //     return $packingGuide->wastes_sum_actual_weight;
                // })
                // ->editColumn('total_packages', function ($packingGuide) {
                //     return $packingGuide->wastes_sum_package_quantity;
                // })
                ->editColumn('volum', function ($packingGuide) {
                    return $packingGuide->volum ?? '-';
                })
                ->editColumn('inter_management.name', function ($packingGuide) {
                    return $packingGuide->interManagement->name ?? '-';
                })
                ->editColumn('status_bool', function ($packingGuide) {
                    return $packingGuide->status;
                })
                ->editColumn('status', function ($packingGuide) {
                    $status = '<span class="info-guide-pending">
                                            Pendiente
                                        </span>';
                    if ($packingGuide->status == 1) {
                        $status = '<span class="info-guide-checked">
                                                Gestionado
                                            </span>';
                    }
                    return $status;
                })
                // ->editColumn('arrived_status', function ($packingGuide) {
                //     $status = '<span class="info-guide-pending">
                //                             Pendiente
                //                         </span>';
                //     if ($packingGuide->stat_arrival == 1) {
                //         $status = '<span class="info-guide-checked">
                //                                 Gestionado
                //                             </span>';
                //     }
                //     return $status;
                // })
                ->editColumn('date_guides_departure', function ($packingGuide) {
                    return getOnlyDate($packingGuide->date_guides_departure);
                })
                ->addColumn('year_month', function ($packingGuide) {
                    return Carbon::parse($packingGuide->date_guides_departure)->format('Y-m');
                })
                ->editColumn('comment', function ($packingGuide) {
                    return $packingGuide->comment ?? '-';
                })
                ->addColumn('action', function ($packingGuide) {

                    $btn = '';

                    if ($packingGuide->status == 1) {
                        $btn .= '<button data-id="' . $packingGuide->id . '"
                                        data-send="' . route('editPackingGuideDeparture.manager', ["guide" => $packingGuide]) . '"
                                        data-url="' . route('edit.updatePGdeparture.manager', ["guide" => $packingGuide]) . '"
                                        data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                                        edit_packing_guide"><i class="fa-solid fa-pen-to-square"></i>
                                    </button>';
                    }

                    return  $btn;
                })
                ->rawColumns(['cod_guide', 'status', 'arrived_status', 'action'])
                ->make(true);

            return $allPackingGuides;
        }
    }

    public function getQueryByFiltersTotal(Request $request)
    {
        if ($request['table'] == 'intGuide') {
            return $this->getQueryFilters('intGuide', $request);
        } else if ($request['table'] == 'departure') {

            $query = GuideWaste::whereHas('packingGuide', function ($q) {
                $q->where('status', 1)
                    ->where('ppc_code', '!=', null);
            });

            if ($request->filled('from_date') && $request->filled('end_date')) {
                $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->whereBetween('date_departure', [$request->from_date, $request->end_date]);
                });
            }

            if ($request->filled('status')) {

                $status = $request['status'] == 'gestionado' ? 1 : null;
                $query = $query->whereHas('packingGuide', function ($q) use ($status) {
                    $q->where('stat_arrival', $status);
                });
            }

            if ($request->filled('ppc_guide')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('ppc_code', $request['ppc_guide']);
                });
            }

            if ($request->filled('manifest')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('manifest_code', $request['manifest']);
                });
            }

            if ($request->filled('waste_departure')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('cod_guide', $request['waste_departure']);
                });
            }

            if ($request->filled('transport')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('shipping_type', $request['transport']);
                });
            }

            if ($request->filled('destination')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('destination', $request['destination']);
                });
            }

            if ($request->filled('guide_gc')) {
                $query = $query->whereHas('packingGuide', function ($q) use ($request) {
                    $q->where('gc_code', $request['guide_gc']);
                });
            }

            if ($request->filled('waste')) {

                $guide_wastes_ids = PackingGuide::where('status', 1)
                    ->where('ppc_code', '!=', null)->with([
                        'firstWaste'
                    ])->get()->pluck('firstWaste.id')->toArray();

                $query = $query->whereHas('packingGuide', function ($q) use ($request, $guide_wastes_ids) {
                    $q->whereHas('firstWaste', function ($q) use ($request, $guide_wastes_ids) {
                        $q->whereIn('id', $guide_wastes_ids)
                            ->whereHas('waste', function ($q) use ($request) {
                                $q->where('waste_types.name', $request['waste']);
                            });
                    });
                });
            }

            return $query;
        } else if ($request['table'] == 'disposition') {

            $query = GuideWaste::has('disposition');

            if ($request->filled('from_date') && $request->filled('end_date')) {
                // $query->whereBetween('date_guides_departure', [$request->from_date, $request->end_date]);
                $query->whereHas('disposition', function ($q) use ($request) {
                    $q->whereBetween('date_departure', [$request->from_date, $request->end_date]);
                });
            }

            if ($request->filled('status')) {
                $status = $request['status'] == 'gestionado' ? 1 : null;
                $query->whereHas('disposition', function ($q) use ($status) {
                    $q->where('status', $status);
                });
            }

            if ($request->filled('guide_gc')) {
                $query->whereHas('disposition', function ($q) use ($request) {
                    $q->where('code_green_care', $request['guide_gc']);
                });
            }

            if ($request->filled('destination')) {
                $query->whereHas('disposition', function ($q) use ($request) {
                    $q->where('destination', $request['destination']);
                });
            }

            if ($request->filled('plate')) {
                $query->whereHas('disposition', function ($q) use ($request) {
                    $q->where('plate_init', $request['plate']);
                });
            }

            if ($request->filled('waste')) {

                $guide_wastes_ids = Disposition::has('wastes')
                    ->with('firstWaste')
                    ->get()->pluck('firstWaste.id')->toArray();

                $query->whereHas('disposition', function ($q) use ($request, $guide_wastes_ids) {
                    $q->whereHas('firstWaste', function ($q) use ($request, $guide_wastes_ids) {
                        $q->whereIn('id', $guide_wastes_ids)
                            ->whereHas('waste', function ($q) use ($request) {
                                $q->where('waste_types.name', $request['waste']);
                            });
                    });
                });
            }

            return $query;
        }
    }

    public function getQueryFilters(string $table, Request $request)
    {
        if ($table == 'intGuide') {

            $selected_stock_ids = $request->session()->get('stock_selected_ids', []);

            $query = GuideWaste::select(
                'guide_wastes.*'
            )
                ->has('guide')
                ->where('gestion_type', 'INTERNA')

                // ->whereHas('guide', function ($query) {
                //     $query->where('stat_approved', 1)
                //         ->where('stat_recieved', 1)
                //         ->where('stat_verified', 1);
                // })
                ->with([
                    'waste.classesWastes',
                    'guide.warehouse.company',
                    // 'package',
                    'packingGuide',
                    'disposition'
                ])
                ->select('guide_wastes.*');

            if ($request->filled('from_date') && $request->filled('end_date')) {

                $startDay = Carbon::parse($request['from_date'])->startOfDay();
                $endDay = Carbon::parse($request['end_date'])->endOfDay();

                $query = $query->whereHas('guide', function ($q) use ($startDay, $endDay) {
                    $q->whereBetween('internment_guides.created_at', [$startDay, $endDay]);
                });
            }

            if ($request->filled('status')) {
                if ($request['status'] != 'all') {
                    $query = $query->where('stat_stock', $request['status']);
                }
            }

            if ($request->filled('selected')) {
                if ($request['selected'] != 'all') {
                    $query = $query->whereIn('guide_wastes.id', $selected_stock_ids);
                }
            }

            if ($request->filled('warehouse')) {
                $query->whereHas('guide', function ($q) use ($request) {
                    $q->where('id_warehouse', $request['warehouse']);
                });
            }


            if ($request->filled('company')) {
                $query->whereHas('guide.warehouse', function ($q) use ($request) {
                    $q->where('id_company', $request['company']);
                });
            }

            if ($request->filled('code')) {
                $query->whereHas('guide.warehouse', function ($q) use ($request) {
                    $q->where('code', $request['code']);
                });
            }

            if ($request->filled('group')) {
                $query->whereHas('waste.classesWastes', function ($q) use ($request) {
                    $q->where('group_id', $request['group']);
                });
            }

            // if ($request->filled('package')) {
            //     $query = $query->where('guide_wastes.id_packageType', $request['package']);
            // }

            if ($request->filled('class')) {
                $query = $query->whereHas('waste', function ($q) use ($request) {
                    $q->whereHas('classesWastes', function ($q) use ($request) {
                        $q->where('classes_has_wastes.id_class', $request['class']);
                    });
                });
            }

            if ($request->filled('type')) {
                $query = $query->where('id_wasteType', $request['type']);
            }

            return $query;
        }
        if ($table == 'packing') {
            $query = PackingGuide::select('packing_guides.*')
                ->with([
                    'firstWaste.guide',
                    'firstWaste.waste.classesWastes.group',
                    'interManagement'
                ])
                ->withSum('wastes', 'aprox_weight');
            // ->withSum('wastes', 'package_quantity');

            if ($request->filled('from_date') && $request->filled('end_date')) {
                $startDay = Carbon::parse($request['from_date'])->startOfDay();
                $endDay = Carbon::parse($request['end_date'])->endOfDay();

                $query = $query->whereBetween('date_guides_departure', [$startDay, $endDay]);
            }

            if ($request->filled('status')) {
                if ($request['status'] != 'all') {
                    $query = $query->where('status', $request['status']);
                }
            }

            if ($request->filled('group')) {
                $query->whereHas('firstWaste.waste.classesWastes', function ($q) use ($request) {
                    $q->where('group_id', $request['group']);
                });
            }

            if ($request->filled('class')) {
                $query = $query->whereHas('firstWaste.waste', function ($q) use ($request) {
                    $q->whereHas('classesWastes', function ($q) use ($request) {
                        $q->where('classes_has_wastes.id_class', $request['class']);
                    });
                });
            }

            if ($request->filled('type')) {
                $query = $query->whereHas('firstWaste', function ($q) use ($request) {
                    $q->where('id_wasteType', $request['type']);
                });
            }

            return $query;
        }
    }

    public function getQueryByFilters($from_date, $end_date, $status, string $table)
    {
        if ($table == 'intGuide') {

            $query = GuideWaste::select('guide_wastes.*')
                ->join('internment_guides', 'internment_guides.id', '=', 'guide_wastes.id_guide')
                ->orderByDesc('internment_guides.date_verified')
                ->whereHas('guide', function ($query) {
                    $query->where('stat_approved', 1)
                        ->where('stat_recieved', 1)
                        ->where('stat_verified', 1);
                })
                ->with([
                    'waste.classesWastes',
                    'guide',
                    'guide.warehouse.company',
                    'package'
                ]);

            if ($from_date && $end_date) {
                $query = $query->whereHas('guide', function ($query2) use ($from_date, $end_date) {
                    $query2->whereBetween('created_at', [$from_date, $end_date]);
                });
            }

            if ($status != 'all') {
                $query = $query->where('stat_stock', $status);
            }

            return $query;
        } elseif ($table == 'packing') {

            $query = GuideWaste::select('guide_wastes.*')
                ->join('packing_guides', 'packing_guides.id', '=', 'guide_wastes.id_packing_guide')
                ->orderByDesc('packing_guides.date_guides_departure')
                ->whereHas('guide', function ($query) {
                    $query->where('stat_approved', 1)
                        ->where('stat_recieved', 1)
                        ->where('stat_verified', 1);
                })
                ->where('stat_stock', 1)
                ->with([
                    'waste.classesWastes',
                    'guide.warehouse.company',
                    'package',
                    'packingGuide'
                ]);

            if ($from_date && $end_date) {
                $query = $query->whereHas('guide', function ($query2) use ($from_date, $end_date) {
                    $query2->whereBetween('created_at', [$from_date, $end_date]);
                });
            }

            if ($status != 'all') {
                $query = $query->where('stat_departure', $status);
            }

            return $query;
        }
    }

    public function storeWastePartitions(GuideWaste $waste, $request)
    {
        if ($waste->stat_stock == 0) {

            $waste_data = $waste->only([
                'date_departure',
                'shipping_type',
                'destination',
                'ppc_code',
                'manifest_code',
                'date_arrival',
                'date_retirement',
                'gc_code',
                'stat_stock',
                'stat_departure',
                'stat_arrival',
                'stat_transport_departure',
                'stat_disposition',
                'id_guide',
                'id_wasteType',
                'id_packageType',
                'id_packing_guide',
                'id_departure',
                'id_disposition'
            ]);

            $weights_array = $request['partitions_qtty'];

            $total_input = array_sum($weights_array);
            $residue = $waste->actual_weight - $total_input;

            $partition_number_sufix = $waste->partition_number == null ?
                '' :
                $waste->partition_number . '-';

            if ($total_input > $waste->actual_weight) {
                return false;
            }

            foreach ($weights_array as $key => $partition_weight) {
                $current_loop = $key + 1;
                $partition_number = $partition_number_sufix . $current_loop;

                if ($current_loop == 1) {
                    $waste->update([
                        'aprox_weight' => $partition_weight,
                        'actual_weight' => $partition_weight,
                        'package_quantity' => $waste->package_quantity,
                        'partition_number' => $partition_number,
                        'is_residue' => false,
                    ]);
                } else {
                    GuideWaste::create($waste_data + [
                        'aprox_weight' => $partition_weight,
                        'actual_weight' => $partition_weight,
                        'package_quantity' => 0,
                        'partition_number' => $partition_number,
                        'is_residue' => false,
                    ]);
                }
            }

            if ($residue > 0 && isset($current_loop)) {

                $partition_number = $partition_number_sufix . ($current_loop + 1);

                GuideWaste::create($waste_data + [
                    'aprox_weight' => $residue,
                    'actual_weight' => $residue,
                    'package_quantity' => 0,
                    'partition_number' => $partition_number,
                    'is_residue' => true,
                ]);
            }

            return true;
        }

        return false;
    }
}
