<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Helpers\APIHelpers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $departments = Department::where('deleted', false)
                        ->with('manager')
                        ->orderBy('name')
                        ->get();
            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Departments retrieved successfully', $departments));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving departments', $e->getMessage()), 500);
        }
    }

    /**
     * Get a listing of active employees.
     */
    public function activeDepartments()
    {
        try {
            $activeDepartments = Department::where('deleted', false)
                ->where('active', true)
                ->select('id', 'name', 'active')
                ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Active departments retrieved successfully', $activeDepartments));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving active departments', $e->getMessage()), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'manager_id' => 'nullable|exists:employees,id',
            'active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            $department = Department::create([
                'name' => $request->name,
                'manager_id' => $request->manager_id,
                'active' => $request->active,
            ]);
            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Department created successfully', $department), 201);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while creating the department', $e->getMessage()), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        try {
            $department = Department::with('manager')->findOrFail($department->id);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Department retrieved successfully', $department));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving the department', $e->getMessage()), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'manager_id' => 'nullable|exists:employees,id',
            'active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            $department->update([
                'name' => $request->name,
                'manager_id' => $request->manager_id,
                'active' => $request->active,
            ]);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Department updated successfully', $department), 200);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while updating the department', $e->getMessage()), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        try {
            $department = Department::findOrFail($department->id);

            if (!$department) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Department not found', null), 404);
            }

            $department->update(['deleted' => true]);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Department deleted successfully', null), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'Department not found', null), 404);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while deleting the department', $e->getMessage()), 500);
        }
    }
}
