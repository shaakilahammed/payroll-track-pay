<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'address',
        'department_id',
        'hour_rate',
        'loan_balance',
        'unpaid_balance',
        'active',
        'deleted',
    ];
    protected $hidden = ['created_at', 'updated_at'];

    protected $casts = [
        'active' => 'boolean',
        'deleted' => 'boolean',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'employee_id', 'id');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'employee_id', 'id');
    }

    public function salaries()
    {
        return $this->hasMany(Salary::class, 'employee_id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

}
