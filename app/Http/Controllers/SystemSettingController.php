<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSystemSettingRequest;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function index(): Response
    {
        abort_unless(
            auth()->user()?->role === 'admin',
            403
        );

        $settings = $this->settings();

        return Inertia::render(
            'Settings/Index',
            [
                'settings' => [
                    'application_name' =>
                        $settings->application_name,

                    'company_name' =>
                        $settings->company_name,

                    'support_email' =>
                        $settings->support_email,

                    'support_phone' =>
                        $settings->support_phone,

                    'timezone' =>
                        $settings->timezone,

                    'onu_warning_rx_power' =>
                        $settings->onu_warning_rx_power,

                    'onu_critical_rx_power' =>
                        $settings->onu_critical_rx_power,

                    'onu_offline_timeout' =>
                        $settings->onu_offline_timeout,

                    'pon_utilization_warning' =>
                        $settings->pon_utilization_warning,

                    'default_fault_severity' =>
                        $settings->default_fault_severity,

                    'default_fault_assignee_id' =>
                        $settings->default_fault_assignee_id
                            ?? '',

                    'auto_resolve_faults' =>
                        $settings->auto_resolve_faults,
                ],

                'users' => User::query()
                    ->select(
                        'id',
                        'name',
                        'email',
                        'role'
                    )
                    ->orderBy('name')
                    ->get(),

                'timezones' => [
                    [
                        'value' => 'Asia/Dhaka',
                        'label' => 'Asia/Dhaka',
                    ],
                    [
                        'value' => 'Asia/Kolkata',
                        'label' => 'Asia/Kolkata',
                    ],
                    [
                        'value' => 'Asia/Karachi',
                        'label' => 'Asia/Karachi',
                    ],
                    [
                        'value' => 'UTC',
                        'label' => 'UTC',
                    ],
                ],

                'severities' => [
                    [
                        'value' => 'low',
                        'label' => 'Low',
                    ],
                    [
                        'value' => 'medium',
                        'label' => 'Medium',
                    ],
                    [
                        'value' => 'high',
                        'label' => 'High',
                    ],
                    [
                        'value' => 'critical',
                        'label' => 'Critical',
                    ],
                ],

                'systemInfo' => [
                    'application_version' => '1.0.0',

                    'laravel' =>
                        App::version(),

                    'php' =>
                        PHP_VERSION,

                    'frontend' =>
                        'React + Inertia.js',

                    'database' =>
                        strtoupper(
                            config(
                                'database.default'
                            )
                        ),

                    'environment' =>
                        App::environment(),
                ],
            ]
        );
    }

    public function update(
        UpdateSystemSettingRequest $request
    ): RedirectResponse {
        $settings = $this->settings();

        $data = $request->validated();

        $data['auto_resolve_faults'] =
            $request->boolean(
                'auto_resolve_faults'
            );

        $settings->update($data);

        return redirect()
            ->route('settings.index')
            ->with(
                'success',
                'System settings updated successfully.'
            );
    }

    private function settings(): SystemSetting
    {
        $settings =
            SystemSetting::query()->first();

        if ($settings) {
            return $settings;
        }

        return SystemSetting::create([
            'application_name' =>
                'FTTX Network Manager',

            'company_name' =>
                'Asiatel Network Ltd.',

            'timezone' =>
                'Asia/Dhaka',

            'onu_warning_rx_power' =>
                -25,

            'onu_critical_rx_power' =>
                -28,

            'onu_offline_timeout' =>
                5,

            'pon_utilization_warning' =>
                80,

            'default_fault_severity' =>
                'medium',

            'auto_resolve_faults' =>
                false,
        ]);
    }
}
