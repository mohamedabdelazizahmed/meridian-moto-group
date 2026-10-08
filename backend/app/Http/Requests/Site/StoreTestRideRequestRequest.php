<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Motorcycle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

final class StoreTestRideRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name', '')),
            'phone' => trim((string) $this->input('phone', '')),
            'email' => trim((string) $this->input('email', '')),
            'preferred_date' => trim((string) $this->input('preferred_date', '')),
            'motorcycle' => trim((string) $this->input('motorcycle', '')),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^[0-9\s\+\-\(\)]{7,20}$/'],
            'email' => ['required', 'email', 'max:255'],
            'preferred_date' => ['required', 'date', 'after_or_equal:today'],
            'motorcycle' => ['nullable', 'string'],
            'website' => ['prohibited'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $slug = $this->input('motorcycle');
            if ($slug) {
                $moto = Motorcycle::published()->where('slug', $slug)->select(['id'])->first();
                if (! $moto) {
                    $validator->errors()->add('motorcycle', 'The selected motorcycle is invalid.');
                } else {
                    $this->merge(['resolved_motorcycle_id' => $moto->id]);
                }
            }
        });
    }
}
