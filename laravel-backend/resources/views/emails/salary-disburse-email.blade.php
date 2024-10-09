<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{-- <link rel="stylesheet" href="{{ asset('css/mail.css') }}"> --}}
    <title>Pinky Builders</title>
</head>
<div>
    <div style="text-align: justify; margin: 20px;">
        <p>Dear {{ $superAdminName }} Sir,</p>
        <p>Warm greetings and good wishes to you! We hope this email finds you in great health and high spirits. We are pleased to provide you with the details of the salary disbursement:</p>
    </div>

    <div><h1 style="text-align: center; margin-bottom:15px; color:#FC3267;">Pinky Builders Ltd.</h1></div>

    <h2 class="table-title" style="text-align: start; color: #0b6fa4;margin-top:15px">Salary Disbursement</h2>
    <p style="text-align: start; color: #0b6fa4;">Start Date: {{ $salariesData->start_date }}</>
    <p style="text-align: start; color: #0b6fa4;">End Date: {{ $salariesData->end_date }}</p>
    <p style="text-align: start; color: #0b6fa4;">Payment Date: {{ $salariesData->payment_date }}</p>
    {{-- <p style="text-align: start; color: #0b6fa4;">Reference: {{ $salaries[0]->reference }}</h4> --}}

    <table class="container" style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; overflow-x: scroll;">
        <thead style="background-color: #0b6fa4; color: #fff;">
            <tr>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff;">SL</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:150px; text-align:center;">Employee</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Hour Rate</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Total Hour</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Gross Payment</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Loan</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Previous Due</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Payable</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Payment</td>
                <td style="font-weight: 600; padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">Due</td>
            </tr>
        </thead>
        <tbody>
            @if (count($salariesData->salaries) === 0)
            <tr>
                <td colspan="6" style="text-align: center; padding: 10px; border-left: 2px solid #fff;">No salary disbursement</td>
            </tr>
            @else
                @foreach ($salariesData->salaries as $index => $item)
                <tr style="background-color: {{ $index % 2 === 0 ? '#d0e4f5' : '#fff' }};">
                    <td style="padding: 10px; border-left: 2px solid #fff;">{{ intval($index) + 1 }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:150px; text-align:start;">{{ $item->employee->name }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">{{ $item->hour_rate }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">{{ $item->total_hour }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->gross_payment }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->loan_balance }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->previous_due }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->net_pay }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->payment_amount }}</td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">$ {{ $item->due_amount }}</td>
                </tr>
                @endforeach
                <tr style="background-color: #0b6fa4">
                    <td style="padding: 2px; border-left: 2px solid #fff; min-width:100px; text-align:center;" colSpan="10"></td>
                </tr>
                <tr style="background-color: #fff;">
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:right;" colSpan="8" className="right">
                        Total Hours:
                    </td>
                    <td style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;" colSpan="2" className="center">
                        {{ $salariesData->total_hour }}
                    </td>
                </tr>
                <tr style="background-color: #d0e4f5;">
                    <td colSpan="8" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:right;">
                        Total Gross Payment:
                    </td>
                    <td colSpan="2" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">
                        {{ $salariesData->total_gross_payment }}
                    </td>
                </tr>
                <tr style="background-color: #fff;">
                    <td colSpan="8" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:right;">
                        Total Payable Amount:
                    </td>
                    <td colSpan="2" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">
                        {{ $salariesData->total_net_pay }}
                    </td>
                </tr>
                <tr style="background-color: #d0e4f5;">
                    <td colSpan="8" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:right;">
                        Total Payment:
                    </td>
                    <td colSpan="8" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">
                        {{ $salariesData->total_sum_payment }}
                    </td>
                </tr>
                <tr style="background-color: #fff;">
                    <td colSpan="8" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:right;">
                        Total Due Amount:
                    </td>
                    <td colSpan="2" style="padding: 10px; border-left: 2px solid #fff; min-width:100px; text-align:center;">
                        {{ $salariesData->total_due_amount }}
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
</div>
</html>
