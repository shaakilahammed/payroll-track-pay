<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('deleted')->default(false);
            $table->timestamps();

            $table->foreign('manager_id')->references('id')->on('employees')->onDelete('set NULL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
