<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\RoleName;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class UpdateUserRequest extends FormRequest
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
        $userId = $this->route('user')?->id;

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', "unique:users,email,{$userId}"],
            'password' => ['nullable', 'string', Password::min(8)->letters()->numbers()],
            'role' => ['required', 'string', 'in:admin,data_entry'],
            'brand_ids' => ['required_if:role,'.RoleName::DataEntry->value, 'array'],
            'brand_ids.*' => ['integer', 'exists:brands,id'],
        ];
    }
}
