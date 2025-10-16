<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CheckSystemEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('api/system-status/update')) {
            return $next($request);
        }

        $isEnabled = Cache::rememberForever('system_enabled', function () {
            return DB::table('system_status')->value('enabled') ?? false;
        });

        if (!$isEnabled) {
            abort(503, 'El sistema está temporalmente suspendido.');
        }

        return $next($request);
    }
}
