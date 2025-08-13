<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\{Warehouse, User, GuideWaste};

class IntermentGuide extends Model
{
    use HasFactory;
    protected $table = 'internment_guides';

    protected $guarded = [
        'id'
    ];

    // protected $fillable = [
    //     'code',
    //     'comment',
    //     'stat_rejected',
    //     'date_rejected',
    //     'stat_approved',
    //     'date_approved',
    //     'stat_recieved',
    //     'date_recieved',
    //     'stat_verified',
    //     'date_verified',
    //     // 'created_at',
    //     'updated_at',
    //     'id_warehouse',
    //     'id_applicant',
    //     'id_approvant',
    //     'id_reciever',
    //     'id_checker'
    // ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'id_warehouse');
    }

    public function applicant()
    {
        return $this->belongsTo(User::class, 'id_applicant', 'id');
    }

    public function approvant()
    {
        return $this->belongsTo(User::class, 'id_approvant', 'id');
    }

    public function previousApprovants()
    {
        return $this->belongsToMany(User::class, 'guide_has_approvants', 'guide_id', 'approvant_id')
            ->withPivot(['id', 'guide_id', 'approvant_id'])
            ->withTimestamps();
    }

    public function reciever()
    {
        return $this->belongsTo(User::class, 'id_reciever', 'id');
    }

    public function checker()
    {
        return $this->belongsTo(User::class, 'id_checker', 'id');
    }

    public function guideWastes()
    {
        return $this->hasMany(GuideWaste::class, 'id_guide', 'id');
    }
}
