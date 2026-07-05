<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemTransaction;
use App\Models\ActionLog;
use Illuminate\Http\Request;

class ItemTransactionController extends Controller
{
    public function store(Request $request, Item $item)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if ($validated['type'] === 'out' && $item->stock < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Insufficient stock for this transaction.']);
        }

        $transaction = $item->transactions()->create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'notes' => $validated['notes'] ?? '',
        ]);

        if ($validated['type'] === 'in') {
            $item->increment('stock', $validated['quantity']);
        } else {
            $item->decrement('stock', $validated['quantity']);
        }

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Item Transaction',
            'description' => "Stock " . strtoupper($validated['type']) . " for item {$item->name} ({$item->sku}): {$validated['quantity']} units.",
        ]);

        return back()->with('message', 'Transaction recorded successfully.');
    }
}
