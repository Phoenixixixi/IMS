<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::latest()->paginate(10);
        return Inertia::render('Items/Index', ['items' => $items]);
    }

    public function create()
    {
        return Inertia::render('Items/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items,sku|max:100',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ]);

        $item = Item::create($validated);

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Created Item',
            'description' => "Created item: {$item->name} ({$item->sku}) with {$item->stock} stock.",
        ]);

        return redirect()->route('items.index')->with('message', 'Item created successfully.');
    }

    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', ['item' => $item]);
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:items,sku,' . $item->id,
            'description' => 'nullable|string',
        ]);

        $item->update($validated);

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Updated Item',
            'description' => "Updated item: {$item->name} ({$item->sku}).",
        ]);

        return redirect()->route('items.index')->with('message', 'Item updated successfully.');
    }

    public function destroy(Request $request, Item $item)
    {
        $name = $item->name;
        $sku = $item->sku;
        
        $item->delete();

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Deleted Item',
            'description' => "Deleted item: {$name} ({$sku}).",
        ]);

        return redirect()->route('items.index')->with('message', 'Item deleted successfully.');
    }
}
