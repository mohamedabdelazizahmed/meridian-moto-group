<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateMotorcycleRequest extends FormRequest
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
        $motorcycleId = $this->route('motorcycle')?->id;

        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'alpha_dash', 'max:140', "unique:motorcycles,slug,{$motorcycleId}"],
            'price_from' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'engine_cc' => ['required', 'integer', 'min:0', 'max:10000'],
            'power_hp' => ['required', 'integer', 'min:1', 'max:2000'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
        ];
    }
}
