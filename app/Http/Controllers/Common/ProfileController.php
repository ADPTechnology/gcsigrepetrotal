<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Models\{User};
use App\Services\ProfileService;
use Auth;
use Exception;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    private $profileService;

    public function __construct(ProfileService $service)
    {
        $this->profileService = $service;
    }

    public function index()
    {
        $user = Auth::user();
        $user->load(['companies', 'ownerCompany', 'role']);

        return view('principal.common.profile.index', compact('user'));
    }

    public function updatePassword(Request $request, User $user)
    {
        try {
            $success = $this->profileService->updatePassword($request, $user);
        } catch (Exception $e) {
            $success = false;
        }

        $message = getMessageFromSuccess($success, 'updated');

        if ($success) {
            $htmlForm = view('principal.common.profile.partials.components._form_update_password')->render();
        }

        return response()->json([
            'success' => $success,
            'message' => $message,
            'htmlForm' => $htmlForm ?? NULL
        ]);
    }
}
