<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class UserListRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'string', 'in:admin,data_entry'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
