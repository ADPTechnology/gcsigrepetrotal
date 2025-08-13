<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\{GuideWaste};

class Disposition extends Model
{
    use HasFactory;
    protected $table = 'dispositions';
    protected $guarded = [];

    // public function departures()
    // {
    //     return $this->hasMany(Departure::class, 'id_disposition');
    // }

    // public function packingGuides()
    // {
    //     return $this->hasMany(PackingGuide::class, 'id_disposition');
    // }

    // public function wastes()
    // {
    //     return $this->hasManyThrough(GuideWaste::class, PackingGuide::class, 'id_departure', 'id_packing_guide');
    // }

    public function firstWaste()
    {
        return $this->hasOne(GuideWaste::class, 'id_disposition');
    }

    public function wastes()
    {
        return $this->hasMany(GuideWaste::class, 'id_disposition');
    }

    // public function packingGuides()
    // {
    //     return $this->hasManyThrough(PackingGuide::class, Departure::class, 'id_disposition', 'id_departure');
    // }
}
