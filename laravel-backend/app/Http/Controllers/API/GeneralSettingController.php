<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Validator;

class GeneralSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $generalSetting = GeneralSetting::firstOrNew();

            if (!$generalSetting->exists) {
                $generalSetting->save();
            }

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'General settings retrieved successfully', $generalSetting));

        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving general settings', $e->getMessage()), 500);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(GeneralSetting $generalSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GeneralSetting $generalSetting)
    {
        try {
            $validator = Validator::make($request->all(), [
                'company_name' => 'required|string|max:255',
                'company_address' => 'required|string|max:255',
                'company_phone' => 'required|string|max:255',
                'company_email' => 'required|email|max:255',
                'has_project' => 'nullable|boolean',
                'default_sign_in' => 'required|string|max:255',
                'default_sign_out' => 'required|string|max:255',
                'lunch_interval' => 'required|integer|min:0|max:60',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }

            $generalSetting = GeneralSetting::findOrNew($request->id);
            $generalSetting->company_name = $request->company_name;
            $generalSetting->company_address = $request->company_address;
            $generalSetting->company_phone = $request->company_phone;
            $generalSetting->company_email = $request->company_email;
            $generalSetting->has_project = $request->has_project;
            $generalSetting->default_sign_in = $request->default_sign_in;
            $generalSetting->default_sign_out = $request->default_sign_out;
            $generalSetting->lunch_interval = $request->lunch_interval;

            $generalSetting->save();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'General Settings updated successfully', $generalSetting));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while updating the settings', $e->getMessage()), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GeneralSetting $generalSetting)
    {
        //
    }
}
