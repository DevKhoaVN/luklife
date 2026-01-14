<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

class UserAddresses extends Model
{

     use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'recipient_name',
        'recipient_phone',
        'address_line1',
        'address_line2',
        'ward',
        'district',
        'city',
        'postal_code',
        'country',
        'is_default',
        'address_type',

        // Các trường code mới thêm cho tích hợp shipping (GHN/GHTK...)
        'province_code',    // Mã tỉnh/thành (ví dụ: "79" cho TP.HCM theo GSO, hoặc "202" theo GHN)
        'district_code',    // Mã quận/huyện
        'ward_code',        // Mã phường/xã (thường là string)
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
       
        'province_code' => 'string',
        'district_code' => 'string',
        'ward_code'     => 'string',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //
}
