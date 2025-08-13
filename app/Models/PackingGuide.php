<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\{GuideWaste};

class PackingGuide extends Model
{
    use HasFactory;
    protected $table = 'packing_guides';
    protected $guarded = [];

    public function firstWaste()
    {
        return $this->hasOne(GuideWaste::class, 'id_packing_guide', 'id');
    }

    public function wastes()
    {
        return $this->hasMany(GuideWaste::class, 'id_packing_guide', 'id');
    }

    public function interManagement()
    {
        return $this->belongsTo(InterManagement::class, 'inter_management_id');
    }

    // public function departure()
    // {
    //     return $this->belongsTo(Departure::class, 'id_departure');
    // }

    // public function disposition()
    // {
    //     return $this->belongsTo(Disposition::class, 'id_disposition');
    // }
}
