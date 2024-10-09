<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'manager_id',
        'active',
        'deleted',
    ];

    protected $hidden = ['created_at', 'updated_at'];

    protected $casts = [
        'active' => 'boolean',
        'deleted' => 'boolean',
    ];

    public function manager()
    {
        return $this->belongsTo(Employee::class, 'manager_id', 'id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
