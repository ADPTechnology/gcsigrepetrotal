<?php

namespace App\Services;

use App\Models\{IntermentGuide};
use Illuminate\Http\Request;
use DataTables;
use Carbon\Carbon;
use Illuminate\Support\Str;

class InternmentGuideService
{

    public function getQuery($table)
    {
        $query = IntermentGuide::with(['warehouse.lot',
                                        'warehouse.stage',
                                        'warehouse.location',
                                        'warehouse.projectArea',
                                        'warehouse.company',
                                        'warehouse.front'
                                ]);

        if ($table == "pending") {
            $query->where('stat_rejected', 0)
                    ->where(function($query){
                    $query->where('stat_approved', 0)
                        ->orWhere('stat_recieved', 0)
                        ->orWhere('stat_verified', 0);
                });
        }
        else if ($table == "approved") {
            $query->where('stat_approved', 1)
                    ->where('stat_recieved', 1)
                    ->where('stat_verified', 1);
        }
        else if ($table == "rejected") {
            $query->where('stat_rejected', 1);
        }

        return $query;
    }
}
