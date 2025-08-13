<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterManagement extends Model
{
    use HasFactory;

    protected $table = 'inter_managements';

    protected $fillable = [
        'name'
    ];

    public function packingGuides()
    {
        return $this->hasMany(PackingGuide::class, 'inter_management_id');
    }

}
