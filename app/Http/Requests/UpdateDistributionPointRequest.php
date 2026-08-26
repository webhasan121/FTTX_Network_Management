<?php

namespace App\Http\Requests;

use App\Models\DistributionPoint;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDistributionPointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(
            'update',
            $this->route('distribution_point')
        ) ?? false;
    }

    public function rules(): array
    {
        /** @var DistributionPoint $point */
        $point = $this->route(
            'distribution_point'
        );

        return [
            'splitter_id' => [
                'required',
                'exists:splitters,id',
            ],

            'code' => [
                'required',
                'string',
                'max:100',

                Rule::unique(
                    'distribution_points',
                    'code'
                )->ignore($point->id),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                Rule::in([
                    'fdb',
                    'fat',
                    'nap',
                    'odp',
                ]),
            ],

            'total_ports' => [
                'required',
                'integer',
                'min:1',
                'max:128',
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

            'address' => [
                'nullable',
                'string',
                'max:500',
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
            'splitter_id.required' =>
                'Please select a splitter.',

            'code.unique' =>
                'This distribution point code already exists.',

            'used_ports.lte' =>
                'Used ports cannot be greater than total ports.',
        ];
    }
}
