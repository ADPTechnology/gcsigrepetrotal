<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Group, WasteClass, WasteStatus, WasteType};
use DataTables;
use Auth;
use DB;
use Validator;

class WasteController extends Controller
{
    public function index(Request $request)
    {
        if($request->ajax())
        {
            if($request['table'] == 'class')
            {
                $wasteClasses = WasteClass::with(['group', 'status', 'classesWastes']);
                $allClasses = DataTables::of($wasteClasses)
                    ->editColumn('group.name', function ($class) {
                        return $class->group->name ?? '-';
                    })
                    ->editColumn('status.name', function ($class) {
                        return $class->status->name ?? '-';
                    })
                    ->addColumn('types', function($class){
                        $types = $class->classesWastes;
                        $countTypes = $types->count();
                        $count = 1;
                        $typesList = '';
                        foreach($types as $type){
                            if($count == $countTypes){
                                $typesList.= $type->name;
                            }else{
                                $typesList.= $type->name.'<br>';
                            }
                            $count++;
                        }
                        // $typesList.='</ul>';

                        return $typesList;
                    })
                    ->addColumn('action', function($class){
                        $btn = '<button data-toggle="modal" data-id="'.
                                $class->id.'" data-url="'.route('wastes.update', $class).'"
                                data-send="'.route('wastes.edit', $class).'"
                                data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                                editClass"><i class="fa-solid fa-pen-to-square"></i></button>';

                        $btn.= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="'.
                                $class->id.'" data-original-title="delete"
                                data-url="'.route('wastes.delete', $class).'" class="ms-3 edit btn btn-danger btn-sm
                                deleteClass"><i class="fa-solid fa-trash-can"></i></a>';

                        return $btn;
                    })
                    ->rawColumns(['types', 'action'])
                    ->make(true);

                return $allClasses;
            }
            else if($request['table'] == 'type')
            {
                $wasteTypes = WasteType::query();
                $allTypes = DataTables::of($wasteTypes)
                    ->addColumn('action', function($type){
                        $btn = '<button data-id="'.
                                $type->id.'" data-url="'.route('wastesType.update', $type).'"
                                data-original-title="edit" class="me-3 edit btn btn-warning btn-sm
                                editType"><i class="fa-solid fa-pen-to-square"></i></button>';

                        $btn.= '<a href="javascript:void(0)" data-toggle="tooltip" data-id="'.
                                $type->id.'" data-original-title="delete"
                                data-url="'.route('wastesType.delete', $type).'" class="ms-3 edit btn btn-danger btn-sm
                                deleteType"><i class="fa-solid fa-trash-can"></i></a>';

                        return $btn;
                    })
                    ->rawColumns(['action'])
                    ->make(true);

                return $allTypes;
            }
        }

        return view('principal.viewAdmin.wastes.index');
    }

    public function create(Request $request)
    {
        if($request->ajax())
        {
            $wasteTypes = WasteType::all();
            $groups = Group::all();
            $statuses = WasteStatus::all();

            return response()->json([
                "wasteTypes" => $wasteTypes,
                "groups" => $groups,
                "statuses" => $statuses
            ]);
        }
    }

    private function symbolIsValid(string $name, ?WasteClass $class = null) : bool {
        $wasteClass = WasteClass::where('symbol', trim($name))->select('id', 'symbol')->first();

        if ($class && ($wasteClass == null || $class->id == $wasteClass->id)) {
            return true;
        }
        if ($wasteClass == null) return true;
        return false;
    }

    public function validateSymbol(Request $request)
    {
        $name = $request['symbol'];
        $class = $request['id'] ? WasteClass::find($request['id']) : null;

        return $this->symbolIsValid($name, $class) ? 'true' : 'false';
    }


    public function store(Request $request)
    {
        $data = $request->all();

        $waste = WasteClass::create($data);

        DB::transaction(function () use ($waste, $request) {
            DB::table('classes_has_wastes')->whereIn('id_waste', $request['id_waste_types'])->delete();
            $waste->classesWastes()->sync($request['id_waste_types']);
        });

        return response()->json([
            'success' => 'stored successfully'
        ]);
    }

    public function edit(WasteClass $class)
    {
        $selectedTypes = $class->classesWastes->pluck('id')->toArray();
        $types = WasteType::all();
        $groups = Group::all();
        $statuses = WasteStatus::all();

        return response()->json([
            'symbol' => $class->symbol,
            'class' => $class->only(['status_id', 'group_id']),
            'selectedTypes' => $selectedTypes,
            'types' => $types,
            "groups" => $groups,
            "statuses" => $statuses
        ]);
    }

    public function update(Request $request, WasteClass $class)
    {
        $data = $request->all();

        $class->update($data);


        DB::transaction(function () use ($class, $request) {
            DB::table('classes_has_wastes')->whereIn('id_waste', $request['id_waste_types'])->delete();
            $class->classesWastes()->sync($request['id_waste_types']);
        });


        return response()->json([
            "success" => "upated successfully"
        ]);
    }

    public function destroy(WasteClass $class)
    {
        $class->classesWastes()->detach();
        $class->delete();

        return response()->json([
            "success" => true
        ]);
    }




    public function typeStore(Request $request)
    {
        WasteType::create([
            'name' => $request['typeName']
        ]);

        return response()->json([
            'success' => 'store successfully'
        ]);
    }


    public function typeUpdate(Request $request, WasteType $type)
    {
        $type->update([
            "name" => $request['value']
        ]);

        return response()->json([
            "success" => "updated successfully"
        ]);
    }

    public function typeDestroy(WasteType $type)
    {
        $success = false;

        if(($type->classesWastes)->isEmpty())
        {
            $type->delete();
            $success = true;
        }else
        {
            $success = 'invalid';
        }

        return response()->json([
            'success' => $success
        ]);
    }



}



