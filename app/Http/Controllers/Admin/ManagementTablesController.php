<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{DispositionPlace, ExtDisposition, ExtManagement, InterManagement};
use Illuminate\Http\Request;

use DataTables;
use Auth;

class ManagementTablesController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $table = $request['table'];
            if ($table == 'inter_management') {
                $allInterManag = DataTables::of(InterManagement::query())
                    ->addColumn('action', function ($item) {
                        $btn = '<button data-id="' .
                            $item->id . '" data-url="' . route('interManagement.update', ["intManagement" => $item]) . '"
                            data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                            editInterManagment"><i class="fa-solid fa-pen-to-square"></i></button>';
                        $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                            $item->id . '" data-original-title="delete"
                            data-url="' . route('interManagement.delete', ["intManagement" => $item]) . '" class="ms-3 edit btn btn-danger btn-sm
                            deleteInterManagment"><i class="fa-solid fa-trash-can"></i></a>';
                        return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);

                return $allInterManag;
            } else if ($table == 'ext_management') {
                $allItems = DataTables::of(ExtManagement::query())
                    ->addColumn('action', function ($item) {
                        $btn = '<button data-id="' .
                            $item->id . '" data-url="' . route('extManagement.update', ["extManagement" => $item]) . '"
                            data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                            editExtManagment"><i class="fa-solid fa-pen-to-square"></i></button>';
                        $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                            $item->id . '" data-original-title="delete"
                            data-url="' . route('extManagement.delete', ["extManagement" => $item]) . '" class="ms-3 edit btn btn-danger btn-sm
                            deleteExtManagment"><i class="fa-solid fa-trash-can"></i></a>';
                        return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);

                return $allItems;
            } else if ($table == 'ext_disposition') {
                $allItems = DataTables::of(ExtDisposition::query())
                    ->addColumn('action', function ($item) {
                        $btn = '<button data-id="' .
                            $item->id . '" data-url="' . route('extDisposition.update', ["extDisposition" => $item]) . '"
                            data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                            editExtDisposition"><i class="fa-solid fa-pen-to-square"></i></button>';
                        $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                            $item->id . '" data-original-title="delete"
                            data-url="' . route('extDisposition.delete', ["extDisposition" => $item]) . '" class="ms-3 edit btn btn-danger btn-sm
                            deleteExtDisposition"><i class="fa-solid fa-trash-can"></i></a>';
                        return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);

                return $allItems;
            } else if ($table == 'disposition_place') {
                $allItems = DataTables::of(DispositionPlace::query())
                    ->addColumn('action', function ($item) {
                        $btn = '<button data-id="' .
                            $item->id . '" data-url="' . route('dispPlace.update', ["dispPlace" => $item]) . '"
                            data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                            editDisPlace"><i class="fa-solid fa-pen-to-square"></i></button>';
                        $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                            $item->id . '" data-original-title="delete"
                            data-url="' . route('dispPlace.delete', ["dispPlace" => $item]) . '" class="ms-3 edit btn btn-danger btn-sm
                            deleteDisPlace"><i class="fa-solid fa-trash-can"></i></a>';
                        return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);

                return $allItems;
            }
        }

        return view('principal.viewAdmin.managementTables.index');
    }



    // * ------- GESTIÓN INTERNA -------------

    public function IntermentManagementStore(Request $request)
    {
        $data = $request->all();
        $item = InterManagement::create($data);

        return response()->json([
            'success' => 'store successfully'
        ]);
    }

    public function IntermentManagementUpdate(Request $request, InterManagement $intManagement)
    {
        $data = $request->all();
        $intManagement->update($data);

        return response()->json([
            'success' => 'updated successfully'
        ]);
    }

    public function IntermentManagementDelete(InterManagement $intManagement)
    {
        $intManagement->delete();

        return response()->json([
            "success" => true
        ]);
    }




    // * ------- GESTIÓN EXTERNA -------------

    public function ExtManagementStore(Request $request)
    {
        $data = $request->all();
        $item = ExtManagement::create($data);

        return response()->json([
            'success' => 'store successfully'
        ]);
    }

    public function ExtManagementUpdate(Request $request, ExtManagement $extManagement)
    {
        $data = $request->all();
        $extManagement->update($data);

        return response()->json([
            'success' => 'updated successfully'
        ]);
    }

    public function ExtManagementDelete(ExtManagement $extManagement)
    {
        $extManagement->delete();

        return response()->json([
            "success" => true
        ]);
    }



    // * ------- DISPOSICIÓN FINAL EXTERNA -------------

    public function ExtDispositionStore(Request $request)
    {
        $data = $request->all();
        $item = ExtDisposition::create($data);

        return response()->json([
            'success' => 'store successfully'
        ]);
    }

    public function ExtDispositionUpdate(Request $request, ExtDisposition $extDisposition)
    {
        $data = $request->all();
        $extDisposition->update($data);

        return response()->json([
            'success' => 'updated successfully'
        ]);
    }

    public function ExtDispositionDelete(ExtDisposition $extDisposition)
    {
        $extDisposition->delete();

        return response()->json([
            "success" => true
        ]);
    }




    // * ------- LUGAR DISPOSICIÓN -------------

    public function DispPlaceStore(Request $request)
    {
        $data = $request->all();
        $item = DispositionPlace::create($data);

        return response()->json([
            'success' => 'store successfully'
        ]);
    }

    public function DispPlaceUpdate(Request $request, DispositionPlace $dispPlace)
    {
        $data = $request->all();
        $dispPlace->update($data);

        return response()->json([
            'success' => 'updated successfully'
        ]);
    }

    public function DispPlaceDelete(DispositionPlace $dispPlace)
    {
        $dispPlace->delete();

        return response()->json([
            "success" => true
        ]);
    }
}
