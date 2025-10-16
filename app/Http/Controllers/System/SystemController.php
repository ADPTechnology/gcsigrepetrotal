<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SystemController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $incomingToken = $request->bearerToken();
        $validToken = env('SYSTEM_API_TOKEN');

        if (!$incomingToken || $incomingToken != $validToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $enabled = $request->boolean('enabled', true);

        DB::table('system_status')->update([
            'enabled' => $enabled,
            'updated_at' => now(),
        ]);

        Cache::forget('system_enabled');

        return response()->json(['message' => 'System status updated.']);
    }

}
