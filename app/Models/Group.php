<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $table = 'groups';

    protected $fillable = [
        'name'
    ];

    public function wasteClass()
    {
        return $this->hasMany(WasteClass::class, 'group_id', 'id');
    }
}
