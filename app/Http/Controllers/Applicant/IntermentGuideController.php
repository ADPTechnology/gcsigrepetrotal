<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use DataTables;
use DB;
use Carbon\Carbon;
use Validator;
use App\Models\{
    Warehouse,
    WasteClass,
    WasteType,
    IntermentGuide,
    PackageType,
    GuideWaste,
    User
};
use App\Mail\{
    NotificationApproverMail
};
use Exception;
use Illuminate\Support\Facades\Mail;

class IntermentGuideController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if ($request->ajax()) {
            if ($request['table'] == 'pending') {
                $guidesApplicant = $user->applicantGuides()->where('stat_rejected', 0)
                    ->where(function ($query) {
                        $query->where('stat_approved', 0)
                            ->orWhere('stat_recieved', 0)
                            ->orWhere('stat_verified', 0);
                    })
                    ->with([
                        'warehouse.lot',
                        'warehouse.stage',
                        'warehouse.location',
                        'warehouse.projectArea',
                        'warehouse.company',
                        'warehouse.front'
                    ]);

                $allGuides = DataTables::of($guidesApplicant)
                    ->editColumn('created_at', function ($guide) {
                        return $guide->created_at;
                    })
                    ->addColumn('stat_approved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_approved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Aprobado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_recieved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_recieved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Recibido
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_verified', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_verified == 1) {
                            $status = '<span class="info-guide-checked">
                                    Verificado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('action', function ($guide) {
                        $btn = '<a href="' . route('guidesPending.show', $guide) . '"
                            data-original-title="show" class="me-3 edit btn btn-info btn-sm"><i class="fa-solid fa-eye"></i></a>';

                        return $btn;
                    })
                    ->addColumn('pdf', function ($guide) {
                        $btn = '<a href="' . route('generateIntermentGuidePdf', $guide) . '" target="BLANK"
                            data-original-title="show" class="icon-pdf-generate">
                                <i class="fa-solid fa-file-pdf fa-xl"></i>
                            </a>';

                        return $btn;
                    })
                    ->rawColumns(['stat_approved', 'stat_recieved', 'stat_verified', 'action', 'pdf'])
                    ->make(true);
                return $allGuides;
            } elseif ($request['table'] == 'approved') {
                $guidesApplicant = $user->applicantGuides()->where('stat_approved', 1)
                    ->where('stat_recieved', 1)
                    ->where('stat_verified', 1)
                    ->with([
                        'warehouse.lot',
                        'warehouse.stage',
                        'warehouse.location',
                        'warehouse.projectArea',
                        'warehouse.company',
                        'warehouse.front'
                    ]);

                $allGuides = DataTables::of($guidesApplicant)
                    ->editColumn('created_at', function ($guide) {
                        return $guide->created_at;
                    })
                    ->addColumn('stat_approved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_approved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Aprobado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_recieved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_recieved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Recibido
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_verified', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_verified == 1) {
                            $status = '<span class="info-guide-checked">
                                    Verificado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('action', function ($guide) {
                        $btn = '<a href="' . route('guidesApproved.show', $guide) . '"
                            data-original-title="show" class="me-3 edit btn btn-info btn-sm"><i class="fa-solid fa-eye"></i></a>';

                        return $btn;
                    })
                    ->addColumn('pdf', function ($guide) {
                        $btn = '<a href="' . route('generateIntermentGuidePdf', $guide) . '" target="BLANK"
                            data-original-title="show" class="icon-pdf-generate">
                                <i class="fa-solid fa-file-pdf fa-xl"></i>
                            </a>';

                        return $btn;
                    })
                    ->rawColumns(['stat_approved', 'stat_recieved', 'stat_verified', 'action', 'pdf'])
                    ->make(true);

                return $allGuides;
            } elseif ($request['table'] == 'rejected') {
                $guidesApplicant = $user->applicantGuides()->where('stat_rejected', 1)
                    ->with([
                        'warehouse.lot',
                        'warehouse.stage',
                        'warehouse.location',
                        'warehouse.projectArea',
                        'warehouse.company',
                        'warehouse.front'
                    ]);

                $allGuides = DataTables::of($guidesApplicant)
                    ->editColumn('created_at', function ($guide) {
                        return $guide->created_at;
                    })
                    ->addColumn('stat_approved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_approved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Aprobado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_recieved', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_recieved == 1) {
                            $status = '<span class="info-guide-checked">
                                    Recibido
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('stat_verified', function ($guide) {
                        $status = '<span class="info-guide-pending">
                                    Pendiente
                                </span>';
                        if ($guide->stat_verified == 1) {
                            $status = '<span class="info-guide-checked">
                                    Verificado
                                </span>';
                        } elseif ($guide->stat_rejected == 1) {
                            $status = '<span class="info-guide-rejected">
                                        Rechazado
                                    </span>';
                        }
                        return $status;
                    })
                    ->addColumn('action', function ($guide) {
                        $btn = '<a href="' . route('guidesRejected.show', $guide) . '"
                            data-original-title="show" class="me-3 edit btn btn-info btn-sm"><i class="fa-solid fa-eye"></i></a>';

                        return $btn;
                    })
                    ->rawColumns(['stat_approved', 'stat_recieved', 'stat_verified', 'action'])
                    ->make(true);
                return $allGuides;
            }
        }
    }

    public function create()
    {
        $lastGuide =  IntermentGuide::latest()->first();

        $next_id = $lastGuide == null ? 1 : $lastGuide->id + 1;

        $user = Auth::user();
        $user->load('companies');

        $guide_code = '';
        $id_str = strval($next_id);

        for ($i = 1; $i <= (4 - strlen($id_str)); $i++) {
            $guide_code .= '0';
        }

        $warehouses = Warehouse::select('id', 'name', 'id_company')
            ->whereNotNull('name')
            // ->where('id_company', $user->companies->first()->id ?? null)
            ->get()
            ->unique('name');


        $wasteClasses = WasteClass::all();

        $guide_code = 'GI-' . Carbon::now()->format('Y') . '-' . $guide_code . $id_str;

        // $approvings = User::whereHas('role', function ($q) {
        //     $q->whereIn('name', ['APROBANTE']);
        // })
        //     ->whereHas('companies', function ($q2) use ($user) {
        //         $q2->where('companies.id', $user->companies->first()->id ?? null);
        //     })
        //     ->get();

        $html = view('principal.viewAdmin.generatedWastes.partials.components.create', [
            'guide_code' => $guide_code,
            'warehouses' => $warehouses,
            'wasteClasses' => $wasteClasses,
            // 'approvings' => $approvings
        ])->render();

        return response()->json([
            'html' => $html
        ]);

        // return view('principal.viewApplicant.intermentGuides.create', [
        //     'guide_code' => $guide_code,
        //     'warehouses' => $warehouses,
        //     'wasteClasses' => $wasteClasses,
        //     'approvings' => $approvings
        // ]);
    }


    public function getDataWarehouse(Request $request)
    {
        if ($request->ajax()) {
            if ($request['type'] == 'warehouse') {
                $warehouse = Warehouse::with(['lot', 'location', 'projectArea', 'company'])
                    ->where('id', $request['id'])->first();

                return response()->json([
                    'lot' => $warehouse->lot->name,
                    // 'stage' => $warehouse->stage->name,
                    'activity' => $warehouse->activity,
                    'location' => $warehouse->location->name,
                    'proyect' => $warehouse->projectArea->name,
                    'company' => $warehouse->company->name,
                    // 'front' => $warehouse->front->name
                ]);
            } elseif ($request['type'] == 'wasteClass') {
                $wasteClass = WasteClass::findOrFail($request['id']);

                $wasteTypes = $wasteClass->classesWastes;

                return response()->json([
                    "wasteTypes" => $wasteTypes
                ]);
            } elseif ($request['type'] == 'wasteType') {
                $wasteTypes = WasteType::whereIn('id', $request['values'])->with('classesWastes')->get();
                // $packageTypes = PackageType::all();

                return response()->json([
                    "wasteTypes" => $wasteTypes,
                    // "packageTypes" => $packageTypes
                    "gestionTypes" => config('parameters.gestion_types')
                ]);
            }
        }
    }


    public function store(Request $request)
    {
        $user = Auth::user();

        try {
            $guide = IntermentGuide::create([
                "comment" => $request['guide-comment'],
                "stat_rejected" => 0,
                "stat_approved" => 0,
                "stat_recieved" => 0,
                "stat_verified" => 0,
                "id_warehouse" => $request['select-warehouse'],
                "id_applicant" => $user->id,
                "id_approvant" => null
            ]);

            $id_str = strval($guide->id);

            $guide_code = '';

            for ($i = 1; $i <= (4 - strlen($id_str)); $i++) {
                $guide_code .= '0';
            }

            $guide_code = 'GI-' . Carbon::now()->format('Y') . '-' . $guide_code . $id_str;

            $guide->update([
                'code' =>  $guide_code
            ]);

            // $ids_approvants = $request['id_approvant-guide'];

            // $guide->previousApprovants()->attach($ids_approvants);

            foreach ($request['wasteTypesId'] as $id) {
                GuideWaste::create([
                    "gestion_type" => $request['gestionType-' . $id],
                    "aprox_weight" => $request['aproxWeightType-' . $id],
                    // "package_quantity" => $request['packageQuantity-' . $id],
                    "id_guide" => $guide->id,
                    "id_wasteType" => $id,
                    // "id_packageType" => $request['packageType-' . $id],
                    "stat_stock" => 0,
                    "stat_departure" => 0,
                    "stat_arrival" => 0,
                    "stat_transport_departure" => 0,
                    "stat_disposition" => 0
                ]);
            }

            $success = true;

            // if ($guide) {
            //     $approvers_emails = $guide->previousApprovants->map(function ($approvant) {
            //         return $approvant->email;
            //     })->toArray();

            //     try {
            //         Mail::to($approvers_emails)
            //             ->send(new NotificationApproverMail($guide));
            //     } catch (Exception $e) {
            //     }

            //     // return new NotificationApproverMail($user, $guide);
            // }

        } catch (Exception $e) {
            $success = false;
        }

        return response()->json([
            'success' => $success,
            'message' => getMessageFromSuccess($success, 'stored')
        ]);

        // return redirect()->route('guidesPending.index');
    }

    public function pendingGuides()
    {
        return view('principal.viewApplicant.intermentGuides.pending.index');
    }

    public function pendingShow(IntermentGuide $guide)
    {
        $guide = $guide->with([
            'warehouse' => fn($query) =>
            $query->with(['front', 'company', 'location', 'lot', 'projectArea', 'stage'])
        ])
            ->with('approvant.role')
            ->with('applicant.role')
            ->with('reciever.role')
            ->with('checker.role')
            ->with([
                'guideWastes' => fn($query) =>
                $query->with(['waste.classesWastes', 'package'])
            ])
            ->where('id', $guide->id)->first();

        $totalWeight = $guide->guideWastes->sum(function ($waste) {
            return $waste->actual_weight;
        });

        $totalPackage = $guide->guideWastes->sum(function ($waste) {
            return $waste->package_quantity;
        });

        return view('principal.viewApplicant.intermentGuides.pending.show', [
            "guide" => $guide,
            "totalWeight" => $totalWeight,
            "totalPackage" => $totalPackage
        ]);
    }

    public function approvedGuides()
    {
        return view('principal.viewApplicant.intermentGuides.approved.index');
    }

    public function approvedShow(IntermentGuide $guide)
    {
        $guide = $guide->with([
            'warehouse' => fn($query) =>
            $query->with(['front', 'company', 'location', 'lot', 'projectArea', 'stage'])
        ])
            ->with('approvant.role')
            ->with('applicant.role')
            ->with('reciever.role')
            ->with('checker.role')
            ->with([
                'guideWastes' => fn($query) =>
                $query->with(['waste.classesWastes', 'package'])
            ])
            ->where('id', $guide->id)->first();

        $totalWeight = $guide->guideWastes->sum(function ($waste) {
            return $waste->actual_weight;
        });

        $totalPackage = $guide->guideWastes->sum(function ($waste) {
            return $waste->package_quantity;
        });

        return view('principal.viewApplicant.intermentGuides.approved.show', [
            "guide" => $guide,
            "totalWeight" => $totalWeight,
            "totalPackage" => $totalPackage
        ]);
    }

    public function rejectedGuides()
    {
        return view('principal.viewApplicant.intermentGuides.rejected.index');
    }

    public function rejectedShow(IntermentGuide $guide)
    {
        $guide = $guide->with([
            'warehouse' => fn($query) =>
            $query->with(['front', 'company', 'location', 'lot', 'projectArea', 'stage'])
        ])
            ->with('approvant.role')
            ->with('applicant.role')
            ->with('reciever.role')
            ->with('checker.role')
            ->with([
                'guideWastes' => fn($query) =>
                $query->with(['waste.classesWastes', 'package'])
            ])
            ->where('id', $guide->id)->first();

        $totalWeight = $guide->guideWastes->sum(function ($waste) {
            return $waste->actual_weight;
        });

        $totalPackage = $guide->guideWastes->sum(function ($waste) {
            return $waste->package_quantity;
        });

        return view('principal.viewApplicant.intermentGuides.rejected.show', [
            "guide" => $guide,
            "totalWeight" => $totalWeight,
            "totalPackage" => $totalPackage
        ]);
    }
}
