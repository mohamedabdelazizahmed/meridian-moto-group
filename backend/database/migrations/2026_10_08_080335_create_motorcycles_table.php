<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motorcycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price_from', 10, 2);
            $table->unsignedSmallInteger('engine_cc');
            $table->unsignedSmallInteger('power_hp');
            $table->string('image_path')->nullable();
            $table->text('summary')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index('brand_id');
            $table->index(['is_published', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motorcycles');
    }
};
