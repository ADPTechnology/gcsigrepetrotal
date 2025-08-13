<?php

namespace App\Services;

use App\Models\{User};
use Auth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProfileService
{
    public function updatePassword(Request $request, User $user)
    {
        if ($this->validateUpdatePasswordRequest($request)) {
            return $user->update([
                "password" => Hash::make($request['new_password'])
            ]);
        }
    }


    /**
     * @param  \Illuminate\Http\Request  $request
     * @return boolean
     *
     */
    protected function validateUpdatePasswordRequest(Request $request)
    {
        return $request->validate([
            'old_password' => 'required|string|current_password',
            'new_password' => ['required', 'string'],
        ]);
    }
}
