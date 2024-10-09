<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    protected $fillable = ['name', 'start_date', 'due_date', 'budget', 'progress', 'deleted', 'employee_ids'];
    protected $casts = [
        'deleted' => 'boolean',
        'employee_ids' => 'array',
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class);
    }
}
