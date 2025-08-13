<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\WasteType;

class WasteClass extends Model
{
    use HasFactory;
    protected $table = 'waste_classes';
    protected $fillable = [
        'name',
        'symbol',
        'group_id',
        'status_id',
    ];

    public function classesWastes()
    {
        return $this->belongsToMany(WasteType::class, 'classes_has_wastes', 'id_class', 'id_waste')
                    ->withPivot(['id'])->withTimestamps();
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function status()
    {
        return $this->belongsTo(WasteStatus::class, 'status_id', 'id');
    }
}
