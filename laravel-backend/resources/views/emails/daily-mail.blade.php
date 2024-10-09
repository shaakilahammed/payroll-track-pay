<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{-- <link rel="stylesheet" href="{{ asset('css/mail.css') }}"> --}}
    <title>{{ $settings->company_name }}</title>
</head>
<div>
    <div style="text-align: justify; margin: 20px;">
        <p>Dear {{$superAdminName}} Sir,</p>
        <p>Warm greetings and good wishes to you! We hope this email finds you in great health and high spirits. We are pleased to provide you with today's dashboard update:</p>
    </div>

    <div><h1 style="text-align: center; margin-bottom:15px; color:#FC3267;">{{ $settings->company_name }}</h1></div>
    <div class="stats" style="text-align: center;">
        @foreach ($statistics as $item)
        <h5 style="font-width:400"><span style="font-width:600">{{ $item->name }}: </span>{{ $item->number }}</h5>
        @endforeach
    </div>

    <h2 class="table-title" style="text-align: start; color: #0b6fa4;margin-top:15px">Today's Attendance</h2>
    <table class="container" style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; overflow-x: scroll;">
        <thead style="background-color: #0b6fa4; color: #fff;">
            <tr>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff;">SL</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:150px; text-align:center;">Name</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff;  min-width:100px; text-align:center;">Hour Rate</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">Sign in</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Sign out</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Lunch time</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Total Hour</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">Amount</td>
            </tr>
        </thead>
        <tbody>
            @if (count($workingEmployees) === 0)
                <tr>
                    <td colspan="8" style="text-align: center; padding: 10px; border-left: 2px solid #fff;">No employee present</td>
                </tr>
            @else
                @foreach ($workingEmployees as $index => $item)
                <tr style="background-color: {{ $index % 2 === 0 ? '#d0e4f5' : '#fff' }};">
                    <td style="padding: 10px; border-left: 2px solid #fff;">{{ intval($index) + 1 }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:150px;text-align:start;">{{ $item->name }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">$ {{ $item->hour_rate }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->sign_in }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->sign_out }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ App\Utils\Utils::convertMinutesToHoursAndMinutes($item->lunch_time) }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->total_hour }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">$ {{ $item->amount }}</td>
                </tr>
                @endforeach
            @endif
        </tbody>
    </table>

    @if($settings->has_project)
        <h2 class="table-title" style="text-align: start;color: #0b6fa4;margin-top:15px ">Running Project</h2>
        <table class="container" style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; overflow-x: scroll;">
            <thead style="background-color: #0b6fa4; color: #fff;">
                <tr>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff;">SL</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:150px;text-align:center;">Name</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">Budget</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">Start Date</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">Due Date</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Progress</td>
                    <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:150px;text-align:center;">Assigned Employees</td>
                </tr>
            </thead>
            <tbody>
                @if (count($incompleteProjects) === 0)
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 10px; border-left: 2px solid #fff;">No project running</td>
                    </tr>
                @else
                    @foreach ($incompleteProjects as $index => $item)
                    <tr style="background-color: {{ $index % 2 === 0 ? '#d0e4f5' : '#fff' }};">
                        <td style="padding: 10px; border-left: 2px solid #fff;">{{ intval($index) + 1 }}</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:150px;text-align:start;">{{ $item->name }}</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">$ {{ $item->budget }}</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->start_date }}</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->due_date }}</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px;text-align:center;">{{ $item->progress }}%</td>
                        <td style="padding: 10px; border-left: 2px solid #fff; min-width:150px;text-align:center;">
                            @foreach ($item->employee_ids as $key => $employee)
                            {{ $employee->label }}
                            @if ($key < count($item->employee_ids) - 1)
                                {{ ', ' }}
                            @endif
                            @endforeach
                        </td>
                    </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    @endif
</div>
</html>
