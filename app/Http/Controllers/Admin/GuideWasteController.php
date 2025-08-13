<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuideWaste;
use App\Models\PackageType;
use App\Models\PackingGuide;
use App\Models\WasteClass;
use App\Services\{GuideWasteService};
use Carbon\Carbon;
use Excel;
use Exception;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xls\Escher;

class GuideWasteController extends Controller
{
    private $guideWastesService;

    public function __construct(GuideWasteService $service)
    {
        $this->guideWastesService = $service;
    }

    public function edit(GuideWaste $waste)
    {
        $waste->load([
            'guide:id,code,created_at',
            'waste.classesWastes',
            'packingGuide',
            'package',
        ]);

        // $waste->guide->date_approved = Carbon::parse($waste->guide->date_approved)->format('Y-m-d\TH:i');
        // $waste->guide->date_verified = Carbon::parse($waste->guide->date_verified)->format('Y-m-d\TH:i');

        $classes = WasteClass::with('classesWastes')->get();
        $waste_class = $classes->first(function ($value) use ($waste) {
            return $value->id == $waste->waste->classesWastes[0]->id;
        });

        // $packages_types = PackageType::get(['id', 'name']);

        return response()->json([
            'waste' => $waste,
            'waste_class' => $waste_class,
            'classes' => $classes,
            'gestion_types' => config('parameters.gestion_types')
        ]);
    }

    public function update(Request $request, GuideWaste $waste)
    {
        // $waste->load(['guide']);

        try {
            $waste = $this->guideWastesService->update($request, $waste);
            $success = True;
        } catch (Exception $e) {
            $success = False;
        }

        $message = getMessageFromSuccess($success, 'updated');

        return response()->json([
            'success' => $success,
            'message' => $message
        ]);
    }

    public function delete(GuideWaste $waste)
    {
        $success = $waste->delete();

        $message = getMessageFromSuccess($success, 'deleted');

        return response()->json([
            'success' => $success,
            'message' => $message
        ]);
    }
}
