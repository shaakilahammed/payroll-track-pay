<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{

    public function index()
    {
        $users = User::where('deleted', false)->select('id', 'name', 'email', 'mobile', 'active', 'super_admin')->get();
        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Users retrieved successfully', $users));
    }

    public function getSuperAdminsEmail()
    {
        $users = User::where('deleted', false)->where('super_admin', true)->select('name', 'email', 'super_admin')->get();
        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Super Admin retrieved successfully', $users));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6',
            'super_admin' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'super_admin' => $request->super_admin ?? false,
            'active' => true,
            'deleted' => false,
        ]);

        return response()->json(APIHelpers::createAPIResponse(false, 201, 'User created successfully', $user), 201);
    }

    public function show($id)
    {
        $user = User::where('deleted', false)->select('id', 'name', 'email', 'mobile', 'active', 'super_admin')->find($id);

        if (!$user) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'User not found', null), 404);
        }

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'User retrieved successfully', $user));
    }

    public function update(Request $request, $id)
    {
        $user = User::where('deleted', false)->select('id', 'name', 'email', 'mobile', 'active', 'super_admin')->find($id);

        if (!$user) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'User not found', null), 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'mobile' => 'required|string|max:20|unique:users,mobile,' . $id,
            'password' => 'nullable|string|min:6',
            'password' => 'nullable|string|min:6',
            'super_admin' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
        ];

        if ($request->has('password') && !empty($request->password)) {
            $updateData['password'] = Hash::make($request->password);
        }

        if ($request->has('super_admin')) {
            $updateData['super_admin'] = $request->super_admin;
        }

        $emailChanged = $user->email !== $request->email;
        $passwordChanged = $request->has('password') && !empty($request->password);
        $superAdminChanged = $request->has('super_admin') && $user->super_admin !== $request->super_admin;

        // If any of these fields have changed, invalidate tokens
        if ($emailChanged || $passwordChanged ||$superAdminChanged) {
            PersonalAccessToken::where('tokenable_id', $user->id)->delete();
        }

        $user->update($updateData);

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'User updated successfully', $user));
    }

    public function destroy($id)
    {
        $user = User::where('deleted', false)->find($id);

        if (!$user) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'User not found', null), 404);
        }

        PersonalAccessToken::where('tokenable_id', $user->id)->delete();

        $user->update(['deleted' => true]);

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'User deleted successfully', null));
    }
}
