<?php

namespace App\Http\Helpers;

class APIHelpers
{
    public static function createAPIResponse($is_error, $code, $message, $content)
    {
        $result = [];

        if ($is_error) {
            $result['success'] = false;
            $result['code'] = $code;
            $result['message'] = $message;

            if ($content != null) {
                $result['errors'] = $content;
            }
        } else {
            $result['success'] = true;
            $result['code'] = $code;
            $result['message'] = $message;

            if ($content != null) {
                $result['data'] = $content;
            }
        }
        return $result;
    }
}
