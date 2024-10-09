<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Attendance;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get the total number of present employees for the current date.
     */
    public function todaysStats()
    {
        try {
            $currentDate = Carbon::today();

            $presentEmployees = Attendance::whereDate('date', $currentDate)
                ->where('present', true)
                ->count();

            $todaysBill = Attendance::whereDate('date', $currentDate)
                ->where('calculated', false)
                ->sum('amount');

            $workHourToday = Attendance::whereDate('date', $currentDate)
                ->where('present', true)
                ->sum('total_hour');

            $totalUnpaidBalance = Attendance::where('calculated', false)
                ->sum('amount');

            $statsArray = [
                [
                    'name' => 'Present Employee',
                    'number' => $presentEmployees,
                    'icon' => 'IoMdPeople',
                ],
                [
                    'name' => "Today's Work Hour",
                    'number' => $workHourToday,
                    'icon' => 'BsHourglass',
                ],
                [
                    'name' => "Today's Bill",
                    'number' => number_format($todaysBill, 2),
                    'icon' => 'FaDollarSign',
                ],
                [
                    'name' => 'Total Unpaid Amount',
                    'number' => number_format($totalUnpaidBalance, 2),
                    'icon' => 'FaDollarSign',
                ],
            ];


            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Today\'s dashboard statistics retrieved successfully', $statsArray));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving the number of present employees for the current date', $e->getMessage()), 500);
        }
    }

    public function getPresentEmployeesData()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $startDate = Carbon::create($currentYear, $currentMonth, 1)->startOfMonth();
        $endDate = Carbon::create($currentYear, $currentMonth, 1)->endOfMonth();

        $daysInMonth = $startDate->daysInMonth;

        $data = Attendance::select(
                DB::raw('DAY(date) as day'),
                DB::raw('COUNT(*) as presentEmployees')
            )
            ->whereBetween('date', [$startDate, $endDate])
            ->where('present', true)
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $presentEmployeesData = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $entry = $data->firstWhere('day', $day);
            $presentEmployeesData[] = $entry ? $entry->presentEmployees : 0;
        }

        $response = [
            'datasets' => [
                [
                    'label' => 'Employee',
                    'data' => $presentEmployeesData,
                    'backgroundColor' => 'rgba(40, 123, 255, 0.5)',
                ],
            ],
            'labels' => range(1, $daysInMonth),
        ];

        return response()->json(APIHelpers::createAPIResponse(false, 200, 'Present employees data retrieved successfully', $response));
    }


    public function todaysWorkingEmployees()
    {
        try {
            $currentDate = Carbon::today();

            $workingEmployees = Attendance::whereDate('date', $currentDate)
                ->where('present', true)
                ->get();

            $workingEmployeesData = [];

            foreach ($workingEmployees as $employee) {
                $employeeData = [
                    'name' => $employee->employee->name,
                    'hour_rate' => $employee->hour_rate,
                    'sign_in' => $employee->sign_in,
                    'sign_out' => $employee->sign_out,
                    'lunch_time' => $employee->lunch_time,
                    'total_hour' => $employee->total_hour,
                    'amount' => $employee->amount,
                ];

                $workingEmployeesData[] = $employeeData;
            }

            return response()->json(APIHelpers::createAPIResponse(false, 200, "Today's working employees retrieved successfully", $workingEmployeesData));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving today\'s working employees', $e->getMessage()), 500);
        }
    }

    /**
     * Get projects with progress less than 100 or due date before current date,
     * sorted by progress in descending order.
     */
    public function getIncompleteProjects()
    {
        try {
            $currentDate = Carbon::now();

            $projects = Project::where('deleted', false)
                        ->where(function ($query) use ($currentDate) {
                            $query->where('progress', '<', 100)
                                ->orWhereDate('due_date', '<', $currentDate->toDateString());
                        })
                        ->orderByDesc('progress')
                        ->get();

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Incomplete projects retrieved successfully', $projects));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving incomplete projects', $e->getMessage()), 500);
        }
    }
}
