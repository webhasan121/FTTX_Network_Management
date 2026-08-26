<?php

namespace App\Http\Requests;

use App\Models\Onu;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOnuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'create',
            Onu::class
        ) ?? false;
    }

    public function rules(): array
    {
        return [
            'distribution_point_id' => [
                'nullable',
                'exists:distribution_points,id',
            ],

            'serial_number' => [
                'required',
                'string',
                'max:255',
                'unique:onus,serial_number',
            ],

            'mac_address' => [
                'nullable',
                'string',
                'max:50',
            ],

            'vendor' => [
                'nullable',
                'string',
                'max:100',
            ],

            'model' => [
                'nullable',
                'string',
                'max:100',
            ],

            'rx_power' => [
                'nullable',
                'numeric',
                'between:-50,20',
            ],

            'tx_power' => [
                'nullable',
                'numeric',
                'between:-20,20',
            ],

            'status' => [
                'required',
                Rule::in([
                    'online',
                    'offline',
                    'los',
                    'disabled',
                ]),
            ],

            'last_seen_at' => [
                'nullable',
                'date',
            ],

            'installed_at' => [
                'nullable',
                'date',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'serial_number.unique' =>
                'This ONU serial number already exists.',

            'distribution_point_id.exists' =>
                'The selected distribution point is invalid.',
        ];
    }
}
