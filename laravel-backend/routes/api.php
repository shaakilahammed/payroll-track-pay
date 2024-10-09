<?php

use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\LoanController;
use App\Http\Controllers\API\MailController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\SalaryController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\GeneralSettingController;
use App\Http\Helpers\APIHelpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('throttle:60,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    // Route::get('/me', [UserController::class, 'me']);
    Route::get('/send-mail', [MailController::class, 'sendDailyMail']);
    Route::post('/verify-token', [AuthController::class, 'verifyToken']);
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);

    Route::prefix('/general-settings')->group(function () {
        Route::get('/', [GeneralSettingController::class, 'index']);
        Route::put('/', [GeneralSettingController::class, 'update']);
    });

    Route::prefix('/stats')->group(function () {
        Route::get('/today', [DashboardController::class, 'todaysStats']);
        Route::get('/present-employee-data', [DashboardController::class, 'getPresentEmployeesData']);
        Route::get('/working-employees', [DashboardController::class, 'todaysWorkingEmployees']);
        Route::get('/running-projects', [DashboardController::class, 'getIncompleteProjects']);
    });

    Route::prefix('/users')->group(function () {
        Route::middleware('superadmin')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
        });
    });

    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::get('/active', [EmployeeController::class, 'activeEmployees']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::patch('/{id}/toggle-active', [EmployeeController::class, 'toggleActive']);
        Route::middleware('superadmin')->group(function () {
            Route::put('/{id}', [EmployeeController::class, 'update']);
            Route::delete('/{id}', [EmployeeController::class, 'destroy']);
        });
    });

    Route::prefix('attendances')->group(function () {
        // Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::post('/show', [AttendanceController::class, 'showByDate']);
        Route::post('/report', [AttendanceController::class, 'showReport']);
        Route::post('/overall-report', [AttendanceController::class, 'showReportAll']);
    });

    Route::prefix('loans')->group(function () {
        Route::middleware('superadmin')->group(function () {
            // Route::get('/', [LoanController::class, 'index']);
            Route::get('/', [LoanController::class, 'getFilteredData']);
            Route::get('/{id}', [LoanController::class, 'show']);
            Route::post('/', [LoanController::class, 'store']);
            Route::patch('/{id}', [LoanController::class, 'update']);
            Route::delete('/{id}', [LoanController::class, 'destroy']);
        });
    });

    Route::group(['prefix' => 'projects'], function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::get('/{project}', [ProjectController::class, 'show']);
        Route::patch('/{project}', [ProjectController::class, 'update']);
        Route::middleware('superadmin')->group(function () {
            Route::delete('/{project}', [ProjectController::class, 'destroy']);
        });
    });

    Route::group(['prefix' => 'departments'], function () {
        Route::get('/', [DepartmentController::class, 'index']);
        Route::get('/active', [DepartmentController::class, 'activeDepartments']);
        Route::post('/', [DepartmentController::class, 'store']);
        Route::get('/{department}', [DepartmentController::class, 'show']);
        Route::patch('/{department}', [DepartmentController::class, 'update']);
        Route::middleware('superadmin')->group(function () {
            Route::delete('/{department}', [DepartmentController::class, 'destroy']);
        });
    });

    Route::prefix('salaries')->group(function () {
        // Payment History
        Route::middleware('superadmin')->group(function () {
            Route::get('/references', [SalaryController::class, 'getUniqueReferences']);
            Route::get('/references/{name}', [SalaryController::class, 'getSalariesByReference']);
            Route::get('/references/{name}/{employeeId}', [SalaryController::class, 'getSalariesByReferenceByEmployeeId']);

            // Salary Disbursement
            Route::post('/get-data', [SalaryController::class, 'getSalaryData']);
            Route::post('/get-data/{employeeId}', [SalaryController::class, 'getSalaryDataByEmployeeId']);
            Route::post('/', [SalaryController::class, 'store']);

            // Salary Report
            Route::post('/report', [SalaryController::class, 'generateSalaryReport']);

            // Route::get('/', [LoanController::class, 'getFilteredData']);
            // Route::get('/{id}', [LoanController::class, 'show']);
            // Route::patch('/{id}', [LoanController::class, 'update']);
            // Route::delete('/{id}', [LoanController::class, 'destroy']);
        });
    });

    // Route::prefix('loan-payments')->group(function () {
    //     Route::get('/', [LoanPaymentController::class, 'index']);
    //     // Route::get('/{id}', [LoanPaymentController::class, 'show']);
    //     Route::get('/employees/{employeeId}', [LoanPaymentController::class, 'getByEmployeeId']);
    //     Route::get('/employees', [LoanPaymentController::class, 'getAllEmployeeData']);
    //     Route::post('/', [LoanPaymentController::class, 'store']);
    // });
});


Route::fallback(function () {
    return response()->json(APIHelpers::createAPIResponse(true, 404, 'Not Found!', null), 404);
});
