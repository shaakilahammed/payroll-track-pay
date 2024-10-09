<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Attendance;
use App\Models\Employee;
use App\Utils\Utils;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AttendanceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            '*.employee_id' => 'required|exists:employees,id',
            '*.date' => 'nullable|date',
            '*.present' => 'required|boolean',
            '*.sign_in' => [
                'required_if:*.present,true',
                'nullable',
                // 'date_format:H:i:s',
            ],
            '*.sign_out' => [
                'required_if:*.present,true',
                'nullable',
                // 'date_format:H:i:s',
            ],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        $attendances = [];

        // return $request->all();

        try {
            DB::beginTransaction();

            foreach ($request->all() as $data) {
                // If date is not provided, set it to the current date
                $date = isset($data['date']) ? Carbon::parse($data['date']) : Carbon::now();

                if ($data['present'] && (!$data['sign_in'] || !$data['sign_out'])) {
                    $errors = [
                        'sign_in' => ['Sign In time is required when present is true.'],
                        'sign_out' => ['Sign Out time is required when present is true.'],
                    ];
                    return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
                }

                 // Add validation for signIn time less than signOut time
                if ($data['present'] && Carbon::parse($data['sign_in'])->greaterThanOrEqualTo(Carbon::parse($data['sign_out']))) {
                    $errors = [
                        'sign_in' => ['Sign In time must be less than Sign Out time.'],
                        'sign_out' => ['Sign Out time must be greater than Sign In time.'],
                    ];
                    return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
                }

                // Update or create the attendance record
                $attendance = Attendance::updateOrCreate(
                    ['employee_id' => $data['employee_id'], 'date' => $date],
                    [
                        'sign_in' => $data['present'] ? $data['sign_in'] : null,
                        'sign_out' => $data['present'] ? $data['sign_out'] : null,
                        'lunch_time' => $data['lunch_time'] ? $data['lunch_time'] : 0,
                        'present' => $data['present'] ?? false,
                    ]
                );

                if ($attendance->calculated === true) {
                    continue; // Skip updating this record inside the loop
                }

                if ($data['present']) {
                    $employee = Employee::findOrFail($data['employee_id']);

                    // Calculate total hour, hour rate, and amount if present is true
                    $hour_rate = $employee->hour_rate ?? 0;
                    $total_hour = Utils::calculateTotalHour($data['sign_in'], $data['sign_out'], $data['lunch_time']); // Implement this function to calculate total hour based on sign_in and sign_out times
                    $amount = $total_hour * $hour_rate;

                    // if($attendance->wasRecentlyCreated === false){
                    //     $unpaid_balance_diff = $amount - $attendance->amount;
                    //     $employee->unpaid_balance += $unpaid_balance_diff;
                    //     $employee->save();
                    // }else{
                    //     $employee->unpaid_balance += $amount;
                    //     $employee->save();
                    // }

                    $attendance->total_hour = $total_hour;
                    $attendance->hour_rate = $hour_rate;
                    $attendance->amount = $amount;
                    $attendance->calculated = false;
                    $attendance->save();
                }else{
                    $employee = Employee::findOrFail($data['employee_id']);
                    $attendance->total_hour = 0;
                    $attendance->hour_rate = 0;
                    $attendance->amount = 0;
                    $attendance->calculated = false;
                    $attendance->save();

                }

                $attendances[] = $attendance;
            }

            DB::commit();

            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Attendance created/updated successfully', $attendances), 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error creating/updating attendance.', null), 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }

    /**
     * show Attendace Report.
     */
    public function showReport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_date' => 'required|date',
                'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
                'sort_order' => 'sometimes|in:asc,desc',
                'sort_by' => 'sometimes|in:date,employee_id',
                'employee_id' => 'sometimes|exists:employees,id',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $sortOrder = $request->input('sort_order', 'asc');
            $sortBy = $request->input('sort_by', 'date');
            $employeeId = $request->input('employee_id');

            $query = Attendance::query();

            if ($endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            } else {
                $query->whereDate('date', $startDate);
            }

            if ($employeeId) {
                $query->where('employee_id', $employeeId);
            }

            // Sort the data by date and employee_id
            $query->orderBy('date', $sortOrder)->orderBy('employee_id', $sortOrder);
            $query->with(['employee:id,name'])->select('id', 'employee_id', 'date', 'sign_in', 'sign_out', 'lunch_time', 'total_hour', 'hour_rate', 'amount', 'present', 'calculated');
            $attendances = $query->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Attendance data retrieved successfully', $attendances));
        } catch (QueryException $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error while fetching attendance data.', null), 500);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }

    /**
     * show Attendace Report.
     */
    public function showReportAll(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_date' => 'required|date',
                'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
                'sort_order' => 'sometimes|in:asc,desc',
                'sort_by' => 'sometimes|in:date,employee_id',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $sortOrder = $request->input('sort_order', 'asc');
            $sortBy = $request->input('sort_by', 'date');

            // Query to retrieve attendance statistics
            $query = Attendance::query()
                ->select(DB::raw('DATE(date) as date'),
                         DB::raw('SUM(CASE WHEN present THEN 1 ELSE 0 END) as total_present'),
                         DB::raw('SUM(CASE WHEN NOT present THEN 1 ELSE 0 END) as total_absent'),
                         DB::raw('SUM(total_hour) as total_hour'),
                         DB::raw('SUM(amount) as total_amount'))
                ->where('date', '>=', $startDate)
                ->when($endDate, function ($query, $endDate) {
                    return $query->where('date', '<=', $endDate);
                })
                ->groupBy('date')
                ->orderBy('date', $sortOrder);

            $attendanceData = $query->get();

            $sumTotalHour = $attendanceData->sum('total_hour');
            $sumTotalAmount = $attendanceData->sum('total_amount');

            $response = [
                'attendance_data' => $attendanceData,
                'sum_total_hour' => $sumTotalHour,
                'sum_total_amount' => $sumTotalAmount,
            ];

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Attendance statistics retrieved successfully', $response));
        } catch (QueryException $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error while fetching attendance statistics.', null), 500);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }

    /**
     * show Attendace data by date.
     */
    public function showByDate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'date' => 'nullable|date',
                'department' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
            }


            $date = $request->input('date');
            $department = $request->input('department');
            // return $date;

            $attendances = Employee::leftJoin('attendances', function ($join) use ($date) {
                $join->on('employees.id', '=', 'attendances.employee_id')
                    ->whereDate('attendances.date', $date);
            })
            ->when($department, function ($query, $department) {
                return $query->where('employees.department_id', $department);
            })
            ->where('employees.deleted', false)
            ->where('employees.active', true)
            ->select(
                'employees.id as employee_id',
                'employees.name',
                'employees.hour_rate',
                'attendances.date',
                'attendances.sign_in',
                'attendances.sign_out',
                'attendances.lunch_time',
                'attendances.total_hour',
                'attendances.amount',
                'attendances.present',
                'attendances.calculated'
            )
            ->orderBy('employees.name', 'asc')
            ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Attendance report for ' . $date . ' retrieved successfully', $attendances));
        } catch (QueryException $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'Error while fetching attendance data.', null), 500);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while processing the request.', null), 500);
        }
    }


}
