<?php

namespace App\Http\Requests;

use App\Models\Olt;
use App\Models\PonPort;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePonPortRequest extends FormRequest
{
    /**
     * Determine authorization.
     */
    public function authorize(): bool
    {
        return $this->user()?->can(
            'update',
            $this->route('pon_port')
        ) ?? false;
    }

    /**
     * Validation rules.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var PonPort $port */
        $port = $this->route('pon_port');

        return [
            'olt_id' => [
                'required',
                'exists:olts,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'port_number' => [
                'required',
                'integer',
                'min:1',

                function (
                    string $attribute,
                    mixed $value,
                    \Closure $fail
                ): void {
                    $olt = Olt::find(
                        $this->input('olt_id')
                    );

                    if (
                        $olt &&
                        $olt->total_pon_ports > 0 &&
                        (int) $value > $olt->total_pon_ports
                    ) {
                        $fail(
                            "Port number cannot exceed this OLT's total PON ports ({$olt->total_pon_ports})."
                        );
                    }
                },

                Rule::unique(
                    (new PonPort)->getTable(),
                    'port_number'
                )
                    ->where(
                        fn ($query) =>
                            $query->where(
                                'olt_id',
                                $this->input('olt_id')
                            )
                    )
                    ->ignore($port->id),
            ],

            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:65535',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'disabled',
                ]),
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'olt_id.required' =>
                'Please select an OLT.',

            'olt_id.exists' =>
                'The selected OLT is invalid.',

            'port_number.unique' =>
                'This PON port number already exists under the selected OLT.',
        ];
    }
}
