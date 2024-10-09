<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = [
        'employee_id',
        'date',
        'amount',
        'calculated',
        'deleted',
    ];

    protected $casts = [
        'calculated' => 'boolean',
        'deleted' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }
}
