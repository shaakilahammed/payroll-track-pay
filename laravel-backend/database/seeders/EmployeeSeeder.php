<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('employees')->insert([
                'name' => $faker->name,
                'email' => $faker->email,
                'mobile' => $faker->phoneNumber,
                'address' => $faker->address,
                'hour_rate' => $faker->randomFloat(2, 5, 20),
                'loan_balance' => 0.00,
                'unpaid_balance' => 0.00,
                'active' => $faker->boolean(80), // 80% chance of being true
                'deleted' => $faker->boolean(5), // 5% chance of being true
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
