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

        if ($request->has('code_guide_waste') && $request->has('guide_date')) {
            $waste->load('guide');
            $guide = $waste->guide;

            $original_date = Carbon::parse($guide->created_at);
            $date_part = Carbon::createFromFormat('d/m/Y', $request->guide_date);
            $final_timestamp = $date_part->setTimeFrom($original_date);

            $guide->update([
                'code' => $request->code_guide_waste,
                'created_at' => $final_timestamp
            ]);
        }

        $waste->update([
            'id_wasteType' => $request->waste_type,
            'aprox_weight' => $request->aprox_weight,
            'gestion_type' => $request->gestion_type
        ]);

        return $waste;
    }
}
