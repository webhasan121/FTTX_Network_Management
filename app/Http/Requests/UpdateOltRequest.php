<?php

namespace App\Http\Requests;

use App\Models\Olt;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOltRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('olt')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $olt = $this->route('olt');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Olt)->getTable(), 'code')->ignore($olt),
            ],
            'vendor' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'ip_address' => ['required', 'ip', 'max:45'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'total_pon_ports' => ['required', 'integer', 'min:0', 'max:65535'],
            'status' => ['required', Rule::in(['online', 'offline', 'maintenance'])],
            'description' => ['nullable', 'string'],
        ];
    }
}
