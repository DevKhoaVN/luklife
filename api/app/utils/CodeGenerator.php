<?php

namespace App\Utils;

use Illuminate\Support\Carbon;

class CodeGenerator {
    public static function geneerateSku(): string {
        return Carbon::now()->format('ymdHis').rand(10, 99);
    }
}