<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\Auth\LoginData;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Facades\Auth;

final class AuthService
{
    private const DUMMY_HASH = '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly Hasher $hasher,
        private readonly ConfigRepository $config,
    ) {}

    /**
     * @return array{token: string, user: User}
     */
    public function login(LoginData $data): array
    {
        $user = $this->userRepository->findByEmail($data->email);

        if (! $user) {
            $this->hasher->check($data->password, self::DUMMY_HASH);
            throw new InvalidCredentialsException;
        }

        if (! $this->hasher->check($data->password, $user->password)) {
            throw new InvalidCredentialsException;
        }

        $expiration = (int) $this->config->get('sanctum.expiration', 480);
        $expiresAt = now()->addMinutes($expiration);
        $tokenResult = $user->createToken('admin-panel', ['*'], $expiresAt);

        $loadedUser = $this->userRepository->loadAccessContext($user);

        return [
            'token' => $tokenResult->plainTextToken,
            'user' => $loadedUser,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
        Auth::guard('web')->logout();
    }

    public function currentUser(User $user): User
    {
        return $this->userRepository->loadAccessContext($user);
    }
}
