<?php

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\{
    User,
    IntermentGuide
};

date_default_timezone_set("America/Lima");


function setActive($routeNames)
{
    $routeNames = is_array($routeNames) ? $routeNames : func_get_args();

    return request()->routeIs(...$routeNames) ? 'active' : '';
}

function getDiffForHumansFromTimestamp($timestamp)
{
    return Carbon::parse($timestamp)->diffForHumans();
}

function getCurrentDate()
{
    return Carbon::now('America/Lima')->format('Y-m-d');
}

function getOnlyDate($datetime)
{
    return Carbon::parse($datetime)->format('Y-m-d');
}

function getUserStatusClass(User $user)
{
    return $user->status == 1 ? 'active' : '';
}

function getUserCompany(?User $user, IntermentGuide $guide)
{
    $company = null;

    if ($user) {
        if ($user->companies->isNotEmpty()) {
            $company = $user->companies->first()->name;
        } elseif ($user->ownerCompany != null) {
            $company = $user->ownerCompany->name;
        }
    }

    return $company;
}


function getMessageFromSuccess($success, $context)
{
    $message = $success ? config('parameters.' . $context . '_message') : config('parameters.exception_message');

    return $message;
}

function getDateEsAttribute(string $date)
{
    $date_carbon = Carbon::parse($date);
    $month_es = config('parameters.months_es')[$date_carbon->isoFormat('MM')];

    return  config('parameters.days_es')[$date_carbon->dayOfWeek] . ', ' . $date_carbon->isoFormat('DD') . ' de ' . $month_es . ' del ' . $date_carbon->isoFormat('YYYY');
}
