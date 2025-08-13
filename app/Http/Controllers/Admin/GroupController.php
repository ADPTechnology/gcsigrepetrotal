<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use DataTables;
use Auth;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $groups = Group::query();

            $allGroups = DataTables::of($groups)
                ->addColumn('action', function ($group) {
                    $btn = '<button data-id="' .
                        $group->id . '" data-url="' . route('groups.update', $group) . '"
                                data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                                editGroup"><i class="fa-solid fa-pen-to-square"></i></button>';

                    $btn .= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="' .
                        $group->id . '" data-original-title="delete"
                                data-url="' . route('groups.delete', $group) . '" class="ms-3 edit btn btn-danger btn-sm
                                deleteGroup"><i class="fa-solid fa-trash-can"></i></a>';

                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);

            return $allGroups;
        }
    }

    public function store(Request $request)
    {
        Group::create([
            "name" => $request['name']
        ]);

        return response()->json([
            "success" => 'store successfully'
        ]);
    }

    public function update(Request $request, Group $group)
    {
        $group->update([
            "name" => $request['value']
        ]);

        return response()->json([
            "success" => "updated successfully"
        ]);
    }

    public function delete(Group $group)
    {
        $success = false;

        if (($group->wasteClass)->isEmpty()) {
            $group->delete();
            $success = true;
        } else {
            $success = 'invalid';
        }

        return response()->json([
            'success' => $success
        ]);
    }
}
