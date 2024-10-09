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
        Schema::create('general_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default("Creators City");
            $table->string('company_address')->default("Dhaka, Bangladesh");
            $table->string('company_phone')->default("000-0000-000");
            $table->string('company_email')->default("creators@email.com");
            $table->string('has_project')->default(false);
            $table->string('default_sign_in')->default('08:00');
            $table->string('default_sign_out')->default('16:00');
            $table->integer('lunch_interval')->default(15);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('general_settings');
    }
};
