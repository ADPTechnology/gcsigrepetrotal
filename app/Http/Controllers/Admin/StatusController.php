<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WasteStatus;
use Illuminate\Http\Request;
use DataTables;
use Auth;

class StatusController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $statuses = WasteStatus::query();

            $allStatus = DataTables::of($statuses)
                ->addColumn('action', function ($status) {
                    $btn = '<button data-id="' .
                        $status->id . '" data-url="' . route('status.update', $status) . '"
                                data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                                editStatus"><i class="fa-solid fa-pen-to-square"></i></button>';

                    $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                        $status->id . '" data-original-title="delete"
                                data-url="' . route('status.delete', $status) . '" class="ms-3 edit btn btn-danger btn-sm
                                deleteStatus"><i class="fa-solid fa-trash-can"></i></a>';

                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);

            return $allStatus;
        }
    }

    public function store(Request $request)
    {
        WasteStatus::create([
            "name" => $request['name']
        ]);

        return response()->json([
            "success" => 'store successfully'
        ]);
    }

    public function update(Request $request, WasteStatus $status)
    {
        $status->update([
            "name" => $request['value']
        ]);

        return response()->json([
            "success" => "updated successfully"
        ]);
    }

    public function delete(WasteStatus $status)
    {
        $success = false;

        if (($status->wasteClass)->isEmpty()) {
            $status->delete();
            $success = true;
        } else {
            $success = 'invalid';
        }

        return response()->json([
            'success' => $success
        ]);
    }
}
