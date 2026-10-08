<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class ListMotorcyclesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'featured' => ['nullable', 'boolean'],
            'brand' => ['nullable', 'string', Rule::exists('brands', 'slug')->where('is_active', true)],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
