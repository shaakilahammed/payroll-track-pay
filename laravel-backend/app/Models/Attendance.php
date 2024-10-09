<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    protected $fillable = [
        'employee_id',
        'date',
        'present',
        'sign_in',
        'sign_out',
        'lunch_time',
        'total_hour',
        'hour_rate',
        'amount',
        'calculated',
        'deleted',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected $casts = [
        'present' => 'boolean',
        'calculated' => 'boolean',
        'deleted' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }
}
