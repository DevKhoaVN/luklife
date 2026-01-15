<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    //
    public $timestamps = false; 
    
    protected $fillable = [
        'order_id',
        'transaction_code',
        'payment_method',
        'transaction_amount',
        'processer',
        'processor_response',
        'status',
        'processed_at',
    ];
}
