<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Employee;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $loans = Loan::with('employee:id,name')->where('deleted', false)->get();
            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Loans retrieved successfully', $loans));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving loans', $e->getMessage()), 500);
        }
    }

    public function getFilteredData(Request $request)
    {
        try {
            $month = $request->query('month') ?? Carbon::now()->format('m');
            $year = $request->query('year') ?? Carbon::now()->format('Y');
            $employeeId = $request->query('employee_id');

            $query = Loan::where('deleted', false);

            // Apply filtering based on month and year
            $query->whereMonth('date', $month)->whereYear('date', $year);

            // Apply filtering based on employee ID if provided
            if (!empty($employeeId)) {
                $query->where('employee_id', $employeeId);
            }

            $query->whereHas('employee', fn ($query) => $query->where('deleted', false));

            $query->orderByDesc('date')->orderByDesc('id');

            $loans = $query->with('employee:id,name')->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Filtered loans retrieved successfully', $loans));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving filtered loans', $e->getMessage()), 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            DB::beginTransaction();

            $employee = Employee::findOrFail($request->employee_id);
            $loanAmount = $request->amount ?? 0;

            // Update employee's loan_balance
            $newLoanBalance = $employee->loan_balance + $loanAmount;
            $employee->update(['loan_balance' => $newLoanBalance]);

            // Set the date to the current date if not provided
            $loanDate = $request->date ? Carbon::parse($request->date) : Carbon::now();

            // Create a new loan record in the database
            $loan = Loan::create([
                'employee_id' => $request->employee_id,
                'date' => $loanDate,
                'amount' => $loanAmount,
            ]);

            DB::commit();

            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Loan created successfully', $loan), 201);
        } catch (\Exception $e) {
            // If any exception occurs, rollback the transaction
            DB::rollback();

            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while creating the loan', $e->getMessage()), 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            DB::beginTransaction();

            $loan = Loan::findOrFail($id);

            // Check if the loan is already calculated, and prevent updates if it is
            if ($loan->calculated) {
                return response()->json(APIHelpers::createAPIResponse(true, 400, 'Loan is already calculated and cannot be updated.', null), 400);
            }

            $employee = Employee::findOrFail($request->employee_id);

            $oldLoanAmount = $loan->amount;
            $newLoanAmount = $request->amount ?? 0;

            // If the employee ID is changed, update the employee's loan_balance accordingly
            if ($loan->employee_id !== $request->employee_id) {
                $oldEmployee = Employee::findOrFail($loan->employee_id);
                $oldEmployee->loan_balance -= $oldLoanAmount;
                $oldEmployee->save();

                $employee->loan_balance += $newLoanAmount;
                $employee->save();
            } else {
                // If the employee ID is not changed, update the employee's loan_balance
                $employee->loan_balance += ($newLoanAmount - $oldLoanAmount);
                $employee->save();
            }

            // Update the loan record
            $loan->employee_id = $request->employee_id;
            $loan->amount = $newLoanAmount;
            $loan->date = $request->date ? Carbon::parse($request->date) : Carbon::now();
            $loan->save();

            DB::commit();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Loan updated successfully', $loan), 200);
        } catch (\Exception $e) {
            // If any exception occurs, rollback the transaction
            DB::rollback();

            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while updating the loan', $e->getMessage()), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $loan = Loan::with('employee:id,name')->where('deleted', false)->find($id);
            if (!$loan) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Loan not found', null), 404);
            }
            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Loan retrieved successfully', $loan));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving the loan', $e->getMessage()), 500);
        }
    }


    public function destroy($id)
    {
        try {
            $loan = Loan::where('deleted', false)->find($id);

            if (!$loan) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Loan not found', null), 404);
            }
            // Check if the loan is already calculated, prevent deletion if it is
            if ($loan->calculated) {
                return response()->json(APIHelpers::createAPIResponse(true, 400, 'Loan is already calculated and cannot be deleted.', null), 400);
            }

            // Retrieve the related employee
            $employee = Employee::findOrFail($loan->employee_id);

            DB::beginTransaction();

            // Update the employee's loan_balance
            $employee->loan_balance -= $loan->amount;
            $employee->save();

            // Soft delete the loan record by setting the 'deleted' flag to true
            $loan->deleted = true;
            $loan->save();

            DB::commit();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Loan deleted successfully', null), 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while deleting the loan', $e->getMessage()), 500);
        }
    }


}
