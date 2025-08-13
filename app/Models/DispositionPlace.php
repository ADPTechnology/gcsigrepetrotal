<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DispositionPlace extends Model
{
    use HasFactory;

    protected $table = 'disposition_places';

    protected $fillable = [
        'name'
    ];
}
