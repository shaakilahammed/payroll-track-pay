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
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->date('start_date')->default(DB::raw('CURRENT_DATE'));
            $table->date('end_date')->default(DB::raw('CURRENT_DATE'));
            $table->string('hour_rate');
            $table->decimal('total_hour', 8, 2)->default(0.00);
            $table->decimal('gross_payment', 8, 2)->default(0.00);
            $table->decimal('loan_balance', 8, 2)->default(0.00);
            $table->decimal('previous_due', 8, 2)->default(0.00);
            $table->decimal('net_pay', 8, 2)->default(0.00);
            $table->decimal('payment_amount', 8, 2)->default(0.00);
            $table->decimal('due_amount', 8, 2)->default(0.00);
            $table->string('reference');
            $table->date('date')->default(DB::raw('CURRENT_DATE'));
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
        Schema::dropIfExists('salaries');
    }
};
