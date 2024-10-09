<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Employee;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $employees = Employee::with(['department:id,name'])
                ->where('deleted', false)
                ->select('id', 'name', 'email', 'mobile', 'hour_rate', 'address', 'department_id', 'loan_balance', 'unpaid_balance', 'active')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Employees retrieved successfully', $employees));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving employees', $e->getMessage()), 500);
        }
    }

    /**
     * Get a listing of active employees.
     */
    public function activeEmployees()
    {
        try {
            $activeEmployees = Employee::where('deleted', false)
                ->where('active', true)
                ->select('id', 'name', 'active')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Active employees retrieved successfully', $activeEmployees));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving active employees', $e->getMessage()), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'nullable|string|email|max:255',
                'mobile' => 'nullable|string|max:20',
                'hour_rate' => 'nullable|numeric|min:0',
                'loan_balance' => 'nullable|numeric|min:0',
                'unpaid_balance' => 'nullable|numeric|min:0',
                'address' => 'nullable|string',
                'department_id' => 'nullable|exists:departments,id',
                'active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }

            $employee = Employee::create([
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'hour_rate' => $request->hour_rate ?? 0.00,
                'loan_balance' => $request->loan_balance ?? 0.00,
                'unpaid_balance' => $request->unpaid_balance ?? 0.00,
                'address' => $request->address,
                'department_id' => $request->department_id,
                'active' => $request->active,
            ]);

            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Employee created successfully', $employee), 201);
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while creating the employee', $e->getMessage()), 500);
        }
    }

    /**
        * Toggle the active status of the specified resource.
    */
    public function toggleActive($id)
    {
        try {
            $employee = Employee::where('deleted', false)->findOrFail($id);

            // Toggle the active status
            $employee->active = !$employee->active;
            $employee->save();

            $status = $employee->active ? 'active' : 'inactive';

            return response()->json(APIHelpers::createAPIResponse(false, 200, "Employee is now $status", null));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while toggling employee status', $e->getMessage()), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $employee = Employee::with(['department:id,name'])
                        ->where('deleted', false)
                        ->select('id', 'name', 'email', 'mobile', 'hour_rate', 'address', 'department_id', 'loan_balance', 'unpaid_balance', 'active')
                        ->find($id);

            if (!$employee) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Employee not found', null), 404);
            }

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Employee retrieved successfully', $employee));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving the employee', $e->getMessage()), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::where('deleted', false)->select('id', 'name', 'email', 'mobile', 'hour_rate', 'department_id', 'address', 'loan_balance', 'unpaid_balance', 'active')->find($id);

            if (!$employee) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Employee not found', null), 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'nullable|string|email|max:255' . $id,
                'mobile' => 'nullable|string|max:20' . $id,
                'hour_rate' => 'nullable|numeric|min:0',
                'loan_balance' => 'nullable|numeric|min:0',
                'unpaid_balance' => 'nullable|numeric|min:0',
                'address' => 'nullable|string',
                'department_id' => 'nullable|exists:departments,id',
                'active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }

            $updateData = [
                'name' => $request->has('name') ? $request->name : $employee->name,
                'email' => $request->has('email') ? $request->email : $employee->email,
                'mobile' => $request->has('mobile') ? $request->mobile : $employee->mobile,
                'hour_rate' => $request->has('hour_rate') ? $request->hour_rate : $employee->hour_rate,
                'loan_balance' => $request->has('loan_balance') ? $request->loan_balance : $employee->loan_balance,
                'unpaid_balance' => $request->has('unpaid_balance') ? $request->unpaid_balance : $employee->unpaid_balance,
                'address' => $request->has('address') ? $request->address : $employee->address,
                'department_id' => $request->has('department_id') ? $request->department_id : null,
                'active' => $request->has('active') ? $request->active : $employee->active,
            ];

            $employee->update($updateData);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Employee updated successfully', $employee));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while updating the employee', $e->getMessage()), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $employee = Employee::where('deleted', false)->find($id);

            if (!$employee) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Employee not found', null), 404);
            }

            // Soft delete the employee record by setting the 'deleted' flag to true
            $employee->active = false;
            $employee->deleted = true;
            $employee->save();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Employee deleted successfully', null));
        } catch (Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while deleting the employee', $e->getMessage()), 500);
        }
    }
}
