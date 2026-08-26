<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'application_name' => [
                'required',
                'string',
                'max:100',
            ],

            'company_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'support_email' => [
                'nullable',
                'email',
                'max:150',
            ],

            'support_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'timezone' => [
                'required',
                Rule::in([
                    'Asia/Dhaka',
                    'Asia/Kolkata',
                    'Asia/Karachi',
                    'UTC',
                ]),
            ],

            'onu_warning_rx_power' => [
                'required',
                'numeric',
                'between:-40,-5',
            ],

            'onu_critical_rx_power' => [
                'required',
                'numeric',
                'between:-40,-5',
            ],

            'onu_offline_timeout' => [
                'required',
                'integer',
                'min:1',
                'max:120',
            ],

            'pon_utilization_warning' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],

            'default_fault_severity' => [
                'required',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'critical',
                ]),
            ],

            'default_fault_assignee_id' => [
                'nullable',
                'exists:users,id',
            ],

            'auto_resolve_faults' => [
                'required',
                'boolean',
            ],
        ];
    }
}
