<?php

namespace App\Utils;

use Carbon\Carbon;

class Utils
{
    public static function calculateTotalHour($signIn, $signOut, $lunchTime)
    {
        // The same implementation as before
        $signInTime = Carbon::parse($signIn);
        $signOutTime = Carbon::parse($signOut);

        $signOutTime->subMinutes($lunchTime);

        $totalHour = $signOutTime->diffInHours($signInTime);
        $minutesDifference = $signOutTime->diffInMinutes($signInTime) % 60;
        $totalHour += $minutesDifference / 60;

        return $totalHour;
    }
    public static function verifyTimeFormat ($value) {
        $pattern1 = '/^(0?\d|1\d|2[0-3]):[0-5]\d:[0-5]\d$/';
        $pattern2 = '/^(0?\d|1[0-2]):[0-5]\d\s(am|pm)$/i';
        return preg_match ($pattern1, $value) || preg_match ($pattern2, $value);
    }
    public static function convertMinutesToHoursAndMinutes($totalMinutes)
    {
        if ($totalMinutes === 0) {
            return '-';
        }

        $hours = floor($totalMinutes / 60);
        $minutes = $totalMinutes % 60;

        $result = '';

        if ($hours > 0) {
            $result .= $hours . ' hour' . ($hours > 1 ? 's' : '');
        }

        if ($minutes > 0) {
            if (!empty($result)) {
                $result .= ' ';
            }
            $result .= $minutes . ' minute' . ($minutes > 1 ? 's' : '');
        }

        return trim($result);
    }
}
