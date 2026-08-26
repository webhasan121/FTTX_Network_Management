<?php

namespace App\Http\Requests;

use App\Models\Fault;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFaultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'create',
            Fault::class
        ) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'fault_type' => [
                'required',
                Rule::in([
                    'olt_down',
                    'pon_down',
                    'fiber_cut',
                    'low_signal',
                    'onu_offline',
                    'los',
                    'power',
                    'other',
                ]),
            ],

            'severity' => [
                'required',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'critical',
                ]),
            ],

            'status' => [
                'required',
                Rule::in([
                    'open',
                    'in_progress',
                    'resolved',
                ]),
            ],

            'olt_id' => [
                'nullable',
                'exists:olts,id',
            ],

            'pon_port_id' => [
                'nullable',
                'exists:pon_ports,id',
            ],

            'distribution_point_id' => [
                'nullable',
                'exists:distribution_points,id',
            ],

            'onu_id' => [
                'nullable',
                'exists:onus,id',
            ],

            'description' => [
                'nullable',
                'string',
                'max:3000',
            ],

            'assigned_to' => [
                'nullable',
                'exists:users,id',
            ],

            'reported_at' => [
                'nullable',
                'date',
            ],

            'resolved_at' => [
                'nullable',
                'date',
                'after_or_equal:reported_at',
            ],
        ];
    }
}
