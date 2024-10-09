<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'employee_id',
        'start_date',
        'end_date',
        'hour_rate',
        'total_hour',
        'gross_payment',
        'loan_balance',
        'previous_due',
        'net_pay',
        'payment_amount',
        'due_amount',
        'reference',
        'date',
        'deleted',
    ];

    protected $casts = [
        'deleted' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }
}
