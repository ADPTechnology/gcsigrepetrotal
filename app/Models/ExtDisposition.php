<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExtDisposition extends Model
{
    use HasFactory;

    protected $table = 'ext_dispositions';

    protected $fillable = [
        'name'
    ];
}
