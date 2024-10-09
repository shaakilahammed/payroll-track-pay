<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\DailyMail;
use App\Mail\SalaryDisburseMail;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\GeneralSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class MailController extends Controller
{
    public function sendDailyMail(Request $request)
    {
        // Create an instance of the DashboardController
        $dashboardController = new DashboardController();
        $userController = new UserController();
        $generalSettingController = new GeneralSettingController();

        $settingsResponse = $generalSettingController->index();
        $settingsResponseBody = json_decode($settingsResponse->getContent());

        // Call the todaysWorkingEmployees method and retrieve the response
        $response = $dashboardController->todaysWorkingEmployees();

        // Extract the data from the response
        $responseBody = json_decode($response->getContent());

        $statisticsResponse = $dashboardController->todaysStats();
        $statisticsResponseBody = json_decode($statisticsResponse->getContent());

        // Call the getIncompleteProjects method and retrieve the response
        $incompleteProjectsResponse = $dashboardController->getIncompleteProjects();
        $incompleteProjectsResponseBody = json_decode($incompleteProjectsResponse->getContent());

        $superAdminResponse = $userController->getSuperAdminsEmail();
        $superAdminResponseBody = json_decode($superAdminResponse->getContent());

        if ($responseBody->success && $statisticsResponseBody->success && $incompleteProjectsResponseBody->success) {
            // Prepare the data for the email view
            $emailData = [
                'message' => 'Today\'s Attendance',
                'workingEmployees' => $responseBody->data ?? [],
                'statistics' => $statisticsResponseBody->data,
                'incompleteProjects' => $incompleteProjectsResponseBody->data,
                'generalSettings' => $settingsResponseBody->data,
            ];

            // Send the email using the DailyMail Mailable
            foreach ($superAdminResponseBody->data as $superAdmin) {
                Mail::to($superAdmin->email)->send(new DailyMail($emailData, $superAdmin));
            }

            // Mail::to('sa000565@gmail.com')->send(new DailyMail($emailData));

            return response()->json(['message' => 'Daily email sent successfully']);
        } else {
            return response()->json(['message' => 'Failed to send daily email'], 500);
        }
    }

    public function sendSalaryDisburseMail($reference){
        try {
            $userController = new UserController();
            $salaryController = new SalaryController();

            $superAdminResponse = $userController->getSuperAdminsEmail();
            $superAdminResponseBody = json_decode($superAdminResponse->getContent());


            $salaryResponse = $salaryController->getSalariesByReference($reference);
            $salaryResponseBody = json_decode($salaryResponse->getContent());

            $salariesData = $salaryResponseBody->data;

            if ($superAdminResponseBody->success){
                $emailData = [
                    'message' => 'Salary Disbursement',
                    'salariesData' => $salariesData,
                ];

                // Send the email to all super admins
                foreach ($superAdminResponseBody->data as $superAdmin) {
                    Mail::to($superAdmin->email)->send(new SalaryDisburseMail($emailData, $superAdmin));
                }
                return response()->json(['message' => 'Salary Disburse email sent successfully']);
            } else {
                return response()->json(['message' => 'Failed to send salary disburse email'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send salary disburse email: ' . $e->getMessage()], 500);
        }
    }
}
