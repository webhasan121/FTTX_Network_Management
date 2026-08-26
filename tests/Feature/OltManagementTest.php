<?php

namespace Tests\Feature;

use App\Models\Olt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OltManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_olt_index(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $olt = Olt::factory()->create([
            'name' => 'Banani Central POP OLT',
            'code' => 'OLT-BAN-001',
            'status' => 'online',
        ]);

        $this
            ->actingAs($admin)
            ->get(route('olts.index', ['search' => 'Banani', 'status' => 'online']))
            ->assertInertia(fn (Assert $page) => $page
                ->component('OLT/Index')
                ->where('filters.search', 'Banani')
                ->where('filters.status', 'online')
                ->has('olts.data', 1)
                ->where('olts.data.0.id', $olt->id)
                ->where('olts.data.0.code', 'OLT-BAN-001')
                ->etc()
            );
    }

    public function test_admin_can_create_olt(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this
            ->actingAs($admin)
            ->post(route('olts.store'), $this->validPayload());

        $createdOlt = Olt::where('code', 'OLT-BAN-900')->firstOrFail();

        $response->assertRedirect(route('olts.show', $createdOlt));
        $this->assertDatabaseHas('olts', [
            'code' => 'OLT-BAN-900',
            'name' => 'Banani Test OLT',
            'status' => 'online',
        ]);
    }

    public function test_admin_can_update_olt(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $olt = Olt::factory()->create(['code' => 'OLT-BAN-901']);

        $response = $this
            ->actingAs($admin)
            ->put(route('olts.update', $olt), $this->validPayload([
                'name' => 'Updated Banani OLT',
                'code' => 'OLT-BAN-901',
                'status' => 'maintenance',
            ]));

        $response->assertRedirect(route('olts.show', $olt));
        $this->assertDatabaseHas('olts', [
            'id' => $olt->id,
            'name' => 'Updated Banani OLT',
            'status' => 'maintenance',
        ]);
    }

    public function test_admin_can_delete_olt(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $olt = Olt::factory()->create();

        $this
            ->actingAs($admin)
            ->delete(route('olts.destroy', $olt))
            ->assertRedirect(route('olts.index'));

        $this->assertModelMissing($olt);
    }

    public function test_store_rejects_invalid_required_fields(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this
            ->actingAs($admin)
            ->from(route('olts.create'))
            ->post(route('olts.store'), [])
            ->assertRedirect(route('olts.create'))
            ->assertSessionHasErrors([
                'name',
                'code',
                'vendor',
                'model',
                'ip_address',
                'total_pon_ports',
                'status',
            ]);
    }

    public function test_non_admin_cannot_view_olt_index(): void
    {
        $operator = User::factory()->create(['role' => 'operator']);

        $this
            ->actingAs($operator)
            ->get(route('olts.index'))
            ->assertForbidden();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return [
            ...[
                'name' => 'Banani Test OLT',
                'code' => 'OLT-BAN-900',
                'vendor' => 'Huawei',
                'model' => 'MA5800-X7',
                'ip_address' => '10.20.30.40',
                'location_name' => 'Banani Test POP',
                'latitude' => 23.7939000,
                'longitude' => 90.4066000,
                'total_pon_ports' => 8,
                'status' => 'online',
                'description' => 'Test OLT for management workflow.',
            ],
            ...$overrides,
        ];
    }
}
