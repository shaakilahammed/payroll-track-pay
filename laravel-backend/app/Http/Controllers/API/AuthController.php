<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Response;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'mobile' => 'required|string|max:20|unique:users',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors));
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'active' => true,
            'deleted' => false,
            'super_admin' => false
        ]);

        return response()->json(APIHelpers::createAPIResponse(false, 201, 'User registered successfully', null));
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'password.required' => 'The password field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        // return [$user->password,!Hash::check($request->password, $user->password)];

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Invalid credentials', null));
        }

        if (!$user->active) {
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'User is not active', null));
        }

        if ($user->deleted) {
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'User is deleted', null));
        }

        $token = $user->createToken('api-token')->plainTextToken;

        $data = ['access_token' => $token, 'user' => $user];

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Login successful', $data));
    }

    public function verifyToken(Request $request)
    {
        try {
            // Check if the request has the access token
            $accessToken = $request->input('accessToken');
            if (!$accessToken) {
                return response()->json(['isValid' => false], Response::HTTP_BAD_REQUEST);
            }

            $token = PersonalAccessToken::findToken($accessToken);
            $isValid = $token !== null;
            return response()->json(['isValid' => $isValid], $isValid ? Response::HTTP_OK : Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return response()->json(['isValid' => false], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function me(Request $request)
    {
        if (!$request->user()) {
            return response()->json(APIHelpers::createAPIResponse(true, 401, 'Unauthenticated', null), 401);
        }

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'User details retrieved successfully', $request->user()));
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'mobile' => 'required|string|max:20|unique:users,mobile,' . $request->user()->id,
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors));
        }

        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
        ]);

        if ($request->has('password') && !empty($request->password)) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Profile updated successfully', $user));
    }

    public function logout(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'token' => 'required|string',
        // ], [
        //     'token.required' => 'The token field is required.',
        // ]);

        // if ($validator->fails()) {
        //     $errors = $validator->errors();
        //     return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors));
        // }

        // $request->user()->currentAccessToken()->delete();

        // return response()->json(APIHelpers::createAPIResponse(false, 200, 'User logged out successfully', null));
        $accessToken = $request->bearerToken();

        if (!$accessToken) {
            return response()->json(APIHelpers::createAPIResponse(true, 401, 'Unauthorized. Access token missing.', null), 401);
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'User logged out successfully', null));
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ], [
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)
                    ->where('active', true)
                    ->where('deleted', false)
                    ->first();

        if (!$user) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'User not found or inactive', null));
        }

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Password reset link sent to your email', null));
        } else {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Unable to send reset link', null));
        }
    }
}
