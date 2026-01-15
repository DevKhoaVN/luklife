<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    // use HasFactory, SoftDeletes;

    const TYPE_PERCENTAGE = 'percentage';
    const TYPE_FIXED = 'fixed';

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'min_order_value',
        'max_discount_value',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_value' => 'decimal:2',
        'max_discount_value' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $now);
            });
    }

    // Accessors
    public function getFormattedValueAttribute()
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            return $this->value . '%';
        }
        return number_format($this->value, 0, ',', '.') . ' VNĐ';
    }

    public function getStatusTextAttribute()
    {
        if (!$this->is_active) {
            return 'Đã tắt';
        }

        $now = Carbon::now();

        if ($this->start_date && $this->start_date->isFuture()) {
            return 'Chưa bắt đầu';
        }

        if ($this->end_date && $this->end_date->isPast()) {
            return 'Đã hết hạn';
        }

        return 'Đang hoạt động';
    }

    // Methods
    public function isValid()
    {
        $now = Carbon::now();

        if (!$this->is_active) {
            return false;
        }

        if ($this->start_date && $this->start_date->isFuture()) {
            return false;
        }

        if ($this->end_date && $this->end_date->isPast()) {
            return false;
        }

        return true;
    }
}
