<?php

namespace App\Http\Middleware;

use App\Http\Helpers\APIHelpers;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->super_admin) {
            return $next($request);
        }

        return response()->json(APIHelpers::createAPIResponse(true, 401, 'Unauthorized. You must be a super admin to access this resource.', null), 401);
    }
}
