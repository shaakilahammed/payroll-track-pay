<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'company_name',
        'company_address',
        'company_phone',
        'company_email',
        'has_project',
        'default_sign_in',
        'default_sign_out',
        'lunch_interval',
    ];
    protected $casts = [
        'has_project' => 'boolean',
    ];
}
