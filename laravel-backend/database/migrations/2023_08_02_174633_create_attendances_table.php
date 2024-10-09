<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->date('date')->default(DB::raw('CURRENT_DATE'));
            $table->boolean('present')->default(false);
            $table->string('sign_in')->nullable();
            $table->string('sign_out')->nullable();
            $table->decimal('total_hour', 8, 2)->nullable();
            $table->decimal('hour_rate', 8, 2)->nullable();
            $table->decimal('amount', 8, 2)->nullable();
            $table->boolean('calculated')->default(false);
            $table->string('reference')->nullable();
            $table->boolean('deleted')->default(false);
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
