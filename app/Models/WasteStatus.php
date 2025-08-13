<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteStatus extends Model
{
    use HasFactory;
    protected $table = 'waste_status';

    protected $fillable = [
        'name'
    ];

    public function wasteClass()
    {
        return $this->hasMany(WasteClass::class, 'status_id', 'id');
    }
}
