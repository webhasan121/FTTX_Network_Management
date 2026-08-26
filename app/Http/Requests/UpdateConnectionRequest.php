<?php

namespace App\Http\Requests;

use App\Models\Connection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConnectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'update',
            $this->route('connection')
        ) ?? false;
    }

    public function rules(): array
    {
        /** @var Connection $connection */
        $connection =
            $this->route('connection');

        return [
            'customer_id' => [
                'required',
                'exists:customers,id',
            ],

            'onu_id' => [
                'required',
                'exists:onus,id',

                Rule::unique(
                    'connections',
                    'onu_id'
                )->ignore($connection->id),
            ],

            'connection_code' => [
                'required',
                'string',
                'max:100',

                Rule::unique(
                    'connections',
                    'connection_code'
                )->ignore($connection->id),
            ],

            'status' => [
                'required',

                Rule::in([
                    'active',
                    'inactive',
                    'disconnected',
                ]),
            ],

            'activated_at' => [
                'nullable',
                'date',
            ],

            'disconnected_at' => [
                'nullable',
                'date',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' =>
                'Please select a customer.',

            'onu_id.required' =>
                'Please select an ONU / ONT.',

            'onu_id.unique' =>
                'This ONU / ONT is already assigned to another connection.',

            'connection_code.unique' =>
                'This connection code already exists.',
        ];
    }
}
