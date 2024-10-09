<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Loan;
use App\Models\Salary;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class SalaryController extends Controller
{

    public function getUniqueReferences()
    {
        try {
            $referencesWithTotalPayment = Salary::select('reference', DB::raw('SUM(payment_amount) as total_payment'), 'date as payment_date')
                ->groupBy('reference', 'payment_date')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Successfully retrieved unique references with total payment and dates.', $referencesWithTotalPayment), 200);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving data.', null), 500);
        }
    }

    public function getSalariesByReference($name)
    {
        try {
            $salaries = Salary::where('reference', $name)
            ->with('employee:id,name')
            ->get();
            if (!$salaries) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Reference not found', null), 404);
            }
            $totalSumPayment = number_format($salaries->sum('payment_amount'), 2);
            $totalLoan = number_format($salaries->sum('loan_balance'), 2);
            $totalGrossPayment = number_format($salaries->sum('gross_payment'), 2);
            $totalHour = number_format($salaries->sum('total_hour'), 2);
            $totalDueAmount = number_format($salaries->sum('due_amount'), 2);
            $totalNetPay = number_format($salaries->sum('net_pay'), 2);

            $startDates = $salaries->pluck('start_date')->min();
            $endDates = $salaries->pluck('end_date')->max();
            $paymentDate = $salaries->pluck('date')->unique()->first();

            $data = [
                'salaries' => $salaries,
                'total_sum_payment' => $totalSumPayment,
                'total_loan' => $totalLoan,
                'total_gross_payment' => $totalGrossPayment,
                'total_hour' => $totalHour,
                'total_due_amount' => $totalDueAmount,
                'total_net_pay' => $totalNetPay,
                'start_date' => $startDates,
                'end_date' => $endDates,
                'payment_date' => $paymentDate,
            ];

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Successfully retrieved salaries for the reference.', $data), 200);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving data.', null), 500);
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function getSalaryData(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_date' => 'required|date',
                'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
                'department_id' => 'nullable|exists:departments,id',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }


            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date', $startDate); // If end_date not provided, use start_date

            $employeesQuery = Employee::with('attendances', 'salaries')
            ->where('deleted', false)
            ->where('active', true);

            if ($request->has('department_id') && $request->filled('department_id')) {
                $employeesQuery->where('department_id', $request->input('department_id'));
            }

            $employees = $employeesQuery->get();

            $salaryDataList = [];
            foreach ($employees as $employee) {
                // $hourRate = $employee->attendances()
                //     ->whereDate('date', '>=', $startDate)
                //     ->whereDate('date', '<=', $endDate)
                //     ->avg('hour_rate');

                $hourRates = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->whereNotNull('hour_rate')
                ->where('hour_rate', '>', 0)
                ->distinct('hour_rate')
                ->pluck('hour_rate')
                ->map(function ($hourRate) {
                    return '$' . $hourRate;
                })
                ->implode(', ');

                $grossPayment = $employee->attendances()
                    ->whereDate('date', '>=', $startDate)
                    ->whereDate('date', '<=', $endDate)
                    ->where('calculated', false)
                    ->sum('amount');

                $total_hour = $employee->attendances()
                    ->whereDate('date', '>=', $startDate)
                    ->whereDate('date', '<=', $endDate)
                    ->where('calculated', false)
                    ->sum('total_hour');

                $loan = $employee->loan_balance;
                $dueBalance = $employee->unpaid_balance;

                $netPay = $grossPayment + $dueBalance - $loan;

                $salaryDataList[] = [
                    'employee_id' => $employee->id,
                    'name' => $employee->name,
                    'hour_rate' => $hourRates,
                    'total_hour' => $total_hour,
                    'gross_payment' => $grossPayment,
                    'loan' => $loan,
                    'due_balance' => $dueBalance,
                    'net_pay' => number_format($netPay, 2),
                ];
            }

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Employee salary data list retrieved successfully', $salaryDataList));
        } catch (QueryException $e) {
            // Log the error for debugging purposes
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error querying the database.', null), 500);
        } catch (\Exception $e) {
            // Log the error for debugging purposes

            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }


    public function getSalaryDataByEmployeeId(Request $request, $employeeId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_date' => 'required|date',
                'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
            ]);



            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(['success' => false, 'code' => 422, 'message' => 'Validation Error', 'errors' => $errors], 422);
            }

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date', Carbon::now()->toDateString());

            $attendanceData = Attendance::where('employee_id', $employeeId)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('calculated', false)
                ->select('date', 'hour_rate', 'total_hour', 'amount as gross_amount')
                ->get();

            $formattedHourRates = $attendanceData->pluck('hour_rate')
            ->unique()
            ->reject(fn ($hourRate) => $hourRate <= 0) // Exclude values less than or equal to 0
            ->map(function ($hourRate) {
                return '$' . number_format($hourRate, 2);
            })
            ->implode(', ');

            $totalHour = number_format($attendanceData->sum('total_hour'), 2);
            $grossAmount = number_format($attendanceData->sum('gross_amount'), 2);

            $employee = Employee::findOrFail($employeeId);
            $dueBalance = $employee->unpaid_balance;
            $loanBalance = $employee->loan_balance;
            $employeeName = $employee->name;

            $netAmount = $grossAmount + $dueBalance - $loanBalance;

            $responseData = [
                'salary_data' => $attendanceData,
                'employee_id' => $employeeId,
                'employee_name' => $employeeName,
                'total_hour' => $totalHour,
                'hour_rate' => $formattedHourRates,
                'gross_amount' => $grossAmount,
                'due_balance' => $dueBalance,
                'loan_balance' => $loanBalance,
                'net_amount' => $netAmount,
            ];

            return response()->json(['success' => true, 'code' => 200, 'message' => 'Salary data retrieved successfully', 'data' => $responseData]);
        } catch (QueryException $e) {
            // Log the error for debugging purposes
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error querying the database.', null), 500);
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }

    public function getSalariesByReferenceByEmployeeId($name, $employeeId)
    {
        try {
            $attendances = Attendance::where('reference', $name)
                ->where('employee_id', $employeeId)
                ->get();

            // if ($attendances->isEmpty()) {
            //     return response()->json(APIHelpers::createAPIResponse(true, 404, 'No attendance records found for the reference and employee ID.', null), 404);
            // }

            $salaryData = Salary::where('reference', $name)
            ->where('employee_id', $employeeId)
            ->first();

            // Calculate attendance-based data
            $hourRate = $salaryData->hour_rate;
            $totalHour = $salaryData->total_hour;
            $grossAmount = $salaryData->gross_payment;
            $loanBalance = $salaryData->loan_balance;
            $previousDue = $salaryData->previous_due;
            $netPay = $salaryData->net_pay;
            $paymentAmount = $salaryData->payment_amount;
            $dueAmount = $salaryData->due_amount;
            $paymentDate = $salaryData->date;

            $employee = Employee::find($employeeId);
            $employeeId = $employee->id;
            $employeeName = $employee->name;

            $responseData = [
                'salary_data' => $attendances,
                'employee_id' => $employeeId,
                'employee_name' => $employeeName,
                'total_hour' => $totalHour,
                'hour_rate' => $hourRate,
                'gross_amount' => $grossAmount,
                'loan_balance' => $loanBalance,
                'previous_due' => $previousDue,
                'net_pay' => $netPay,
                'payment_amount' => $paymentAmount,
                'due_amount' => $dueAmount,
                'payment_date' => $paymentDate
            ];

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Successfully retrieved attendance records for the reference and employee ID.', $responseData), 200);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving data.', null), 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            '*.employee_id' => 'required|exists:employees,id',
            '*.start_date' => 'required|date',
            '*.end_date' => 'required|date|after_or_equal:start_date',
            '*.hour_rate' => 'required|string|min:0',
            '*.total_hour' => 'required|numeric|min:0',
            '*.gross_payment' => 'required|numeric|min:0',
            '*.loan_balance' => 'required|numeric|min:0',
            '*.previous_due' => 'required|numeric|min:0',
            '*.net_pay' => 'required|numeric',
            '*.payment_amount' => 'required|numeric|min:0',
            '*.due_amount' => 'required|numeric|min:0',
            '*.reference' => 'required|unique:salaries',
            '*.date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        $salaries = [];

        try {
            DB::beginTransaction();

            foreach ($request->all() as $data) {
                $date = isset($data['date']) ? Carbon::parse($data['date']) : Carbon::now();

                // Assuming the "salaries" table contains columns matching the field names in the validation rules.
                $salary = Salary::create([
                    'employee_id' => $data['employee_id'],
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                    'hour_rate' => $data['hour_rate'],
                    'total_hour' => $data['total_hour'],
                    'gross_payment' => $data['gross_payment'],
                    'loan_balance' => $data['loan_balance'],
                    'previous_due' => $data['previous_due'],
                    'net_pay' => $data['net_pay'],
                    'payment_amount' => $data['payment_amount'],
                    'due_amount' => $data['due_amount'],
                    'reference' => $data['reference'],
                    'date' => $date,
                ]);

                // Update employee's loan_balance
                $employee = Employee::find($data['employee_id']);
                $newLoanBalance = $employee->loan_balance - ($data['gross_payment'] + $data['previous_due']);
                $employee->loan_balance = max($newLoanBalance, 0); // Ensure the balance is non-negative
                $employee->unpaid_balance = $data['net_pay'] <= 0 ? 0 : $data['net_pay'] - $data['payment_amount'];
                $employee->save();

                $attendances = Attendance::where('employee_id', $data['employee_id'])
                ->whereBetween('date', [$data['start_date'], $data['end_date']])
                ->where('calculated', false)
                ->get();

                foreach ($attendances as $attendance) {
                    $attendance->calculated = true;
                    $attendance->reference = $data['reference'];
                    $attendance->save();
                }

                $employee = Employee::find($data['employee_id']);
                $employee->loans()
                    ->where('deleted', false)
                    ->update(['calculated' => true]);

                // Add the created salary record to the $salaries array.
                $salaries[] = $salary;
            }


            DB::commit();

            // $mailController = new MailController();
            // $mailController->sendSalaryDisburseMail($salaries[0]->reference);

            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Salary created successfully', $salaries), 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error creating salary.', null), 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }

    public function generateSalaryReport(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $validator->errors()), 422);
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $employeesQuery = Employee::where('deleted', false)->where('active', true);

        if ($request->has('department_id') && $request->filled('department_id')) {
            $employeesQuery->where('department_id', $request->input('department_id'));
        }

        $employees = $employeesQuery->get();

        $salaryReport = [];

        foreach ($employees as $employee) {
            $total_hour = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('deleted', false)
                ->sum('total_hour');

            $total_gross_payment = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('deleted', false)
                ->sum('amount');

            $total_loan = Loan::where('employee_id', $employee->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('deleted', false)
                ->sum('amount');

            $total_payment = Salary::where('employee_id', $employee->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('deleted', false)
                ->sum('payment_amount');

            $salaryReport[] = [
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
                'total_hour' => $total_hour,
                'total_gross_payment' => $total_gross_payment,
                'total_loan' => $total_loan,
                'total_payment' => $total_payment,
            ];
        }

        $data = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'report_data' => $salaryReport,
        ];

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Salary report generated successfully', $data), 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Salary $salary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Salary $salary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salary $salary)
    {
        //
    }
}
