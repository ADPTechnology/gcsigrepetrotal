<?php

namespace App\Services;

use App\Models\{GuideWaste};
use Illuminate\Http\Request;
use DataTables;
use Carbon\Carbon;
use Illuminate\Support\Str;

class GuideWasteService
{
    public function update(Request $request, GuideWaste $waste)
    {
        // $date_app_old_sec = Carbon::parse($waste->guide->date_approved)->second;
        // $date_verf_old_sec = Carbon::parse($waste->guide->date_verified)->second;

        // $date_app_new = Carbon::parse($request->date_approved)->addSeconds($date_app_old_sec)->format('Y-m-d H:i:s');
        // $date_verf_new = Carbon::parse($request->date_verified)->addSeconds($date_verf_old_sec)->format('Y-m-d H:i:s');

        // $waste->guide->update([
        //     'date_approved' => $date_app_new,
        //     'date_verified' => $date_verf_new
        // ]);

        // if ($waste->packingGuide) {

        //     $waste->packingGuide->update([
        //         'volum' => $request->volum
        //     ]);
        // }

        $waste = $waste->update([
            'id_wasteType' => $request->waste_type,
            // 'id_packageType' => $request->package_type,
            'aprox_weight' => $request->aprox_weight,
            'gestion_type' => $request->gestion_type
        ]);

        return $waste;
    }

}
