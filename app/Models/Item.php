<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['name', 'sku', 'description', 'stock'];

    public function transactions()
    {
        return $this->hasMany(ItemTransaction::class);
    }
}
