<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemTransaction extends Model
{
    protected $fillable = ['item_id', 'user_id', 'type', 'quantity', 'notes'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
