<?php

namespace App\Http\Requests;

use App\Models\Splitter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSplitterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'update',
            $this->route('splitter')
        ) ?? false;
    }

    public function rules(): array
    {
        /** @var Splitter $splitter */
        $splitter = $this->route('splitter');

        return [
            'pon_port_id' => [
                'required',
                'exists:pon_ports,id',
            ],

            'code' => [
                'required',
                'string',
                'max:100',

                Rule::unique(
                    'splitters',
                    'code'
                )->ignore($splitter->id),
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
            'code.unique' =>
                'This splitter code already exists.',

            'used_ports.lte' =>
                'Used ports cannot be greater than total ports.',
        ];
    }
}
