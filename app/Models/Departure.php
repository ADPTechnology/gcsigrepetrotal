<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\{GuideWaste};

class Departure extends Model
{
    use HasFactory;
    protected $table = 'departures';
    protected $guarded = [];

    // public function packingGuides()
    // {
    //     return $this->hasMany(PackingGuide::class, 'id_departure', 'id');
    // }

    public function wastes()
    {
        return $this->hasManyThrough(GuideWaste::class, PackingGuide::class, 'id_departure', 'id_packing_guide');
    }
}
