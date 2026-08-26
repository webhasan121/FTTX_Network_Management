<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_seeder_creates_super_admin_account(): void
    {
        $this->seed(AdminUserSeeder::class);

        $this->assertDatabaseHas('users', [
            'name' => 'Super Admin',
            'email' => 'admin@fttx.test',
            'role' => 'admin',
        ]);

        $admin = User::where('email', 'admin@fttx.test')->firstOrFail();

        $this->assertTrue(Hash::check('password123', $admin->password));
        $this->assertNotNull($admin->email_verified_at);
    }

    public function test_user_role_defaults_to_admin(): void
    {
        $user = User::factory()->create();

        $this->assertSame('admin', $user->refresh()->role);
    }
}
