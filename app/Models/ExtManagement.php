<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExtManagement extends Model
{
    use HasFactory;

    protected $table = 'ext_managements';

    protected $fillable = [
        'name'
    ];
}
