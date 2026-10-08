<?php

declare(strict_types=1);

namespace Tests\Concerns;

use Closure;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Assert;

trait CountsQueries
{
    /**
     * Assert that the query count during the execution of the callback is at most $max.
     */
    protected function assertQueryCountAtMost(int $max, Closure $callback): mixed
    {
        DB::enableQueryLog();
        DB::flushQueryLog();

        try {
            $result = $callback();
            $queries = DB::getQueryLog();
            $count = count($queries);

            Assert::assertLessThanOrEqual(
                $max,
                $count,
                "Expected at most {$max} queries, but executed {$count} queries."
            );

            return $result;
        } finally {
            DB::disableQueryLog();
        }
    }
}
