<?php

namespace App\Http\Requests;

use App\Models\Splitter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSplitterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'create',
            Splitter::class
        ) ?? false;
    }

    public function rules(): array
    {
        return [
            'pon_port_id' => [
                'required',
                'exists:pon_ports,id',
            ],

            'code' => [
                'required',
                'string',
                'max:100',
                'unique:splitters,code',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'ratio' => [
                'required',
                Rule::in([
                    '1:2',
                    '1:4',
                    '1:8',
                    '1:16',
                    '1:32',
                    '1:64',
                ]),
            ],

            'total_ports' => [
                'required',
                'integer',
                'min:1',
                'max:64',
            ],

            'used_ports' => [
                'required',
                'integer',
                'min:0',
                'lte:total_ports',
            ],

            'location_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
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
            'pon_port_id.required' =>
                'Please select a PON port.',

            'code.unique' =>
                'This splitter code already exists.',

            'used_ports.lte' =>
                'Used ports cannot be greater than total ports.',
        ];
    }
}
