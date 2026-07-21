<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemTransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActionLogController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $itemId = request('item_id');
        $month  = request('month'); // 1–12

        // All items for the dropdown
        $items = \App\Models\Item::select('id', 'name')->orderBy('name')->get();

        $totalItems = \App\Models\Item::count();
        $totalStock = \App\Models\Item::sum('stock');
        $totalUsers = \App\Models\User::count();
        $recentLogs = \App\Models\ActionLog::with('user:id,name')->latest()->take(5)->get();

        // Stock in/out for last 7 days — optionally filtered by item
        $stockInQuery  = \App\Models\ItemTransaction::where('type', 'in')->where('created_at', '>=', now()->subDays(7));
        $stockOutQuery = \App\Models\ItemTransaction::where('type', 'out')->where('created_at', '>=', now()->subDays(7));
        if ($itemId) {
            $stockInQuery->where('item_id', $itemId);
            $stockOutQuery->where('item_id', $itemId);
        }
        $stockIn  = $stockInQuery->sum('quantity');
        $stockOut = $stockOutQuery->sum('quantity');

        // Low stock items
        $lowStockItems = \App\Models\Item::where('stock', '<', 5)->count();

        // Monthly transaction chart data (last 6 months)
        $monthlyData = [];
        $baseDate = now();
        for ($i = 5; $i >= 0; $i--) {
            $m = (clone $baseDate)->subMonths($i);

            // If a specific month is selected, only show that month's data
            if ($month && $m->month != $month) {
                continue;
            }

            $inQ  = \App\Models\ItemTransaction::where('type', 'in')->whereYear('created_at', $m->year)->whereMonth('created_at', $m->month);
            $outQ = \App\Models\ItemTransaction::where('type', 'out')->whereYear('created_at', $m->year)->whereMonth('created_at', $m->month);

            if ($itemId) {
                $inQ->where('item_id', $itemId);
                $outQ->where('item_id', $itemId);
            }

            $monthlyData[] = [
                'label' => $m->format('M'),
                'in'    => $inQ->sum('quantity'),
                'out'   => $outQ->sum('quantity'),
            ];
        }

        return Inertia::render('dashboard', [
            'items'   => $items,
            'filters' => [
                'item_id' => $itemId ? (int) $itemId : null,
                'month'   => $month  ? (int) $month  : null,
            ],
            'stats' => [
                'totalItems'    => $totalItems,
                'totalStock'    => $totalStock,
                'totalUsers'    => $totalUsers,
                'stockIn'       => $stockIn,
                'stockOut'      => $stockOut,
                'lowStockItems' => $lowStockItems,
            ],
            'recentLogs'  => $recentLogs,
            'monthlyData' => $monthlyData,
        ]);
    })->name('dashboard');

    Route::resource('items', ItemController::class);
    Route::post('items/{item}/transactions', [ItemTransactionController::class, 'store'])->name('item-transactions.store');
    
    Route::get('logs', [ActionLogController::class, 'index'])->name('logs.index');

    Route::middleware(['App\Http\Middleware\EnsureIsSuperAdmin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
