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
        $totalItems = \App\Models\Item::count();
        $totalStock = \App\Models\Item::sum('stock');
        $totalUsers = \App\Models\User::count();
        $recentLogs = \App\Models\ActionLog::with('user:id,name')->latest()->take(5)->get();

        // Stock in/out for last 7 days
        $stockIn = \App\Models\ItemTransaction::where('type', 'in')
            ->where('created_at', '>=', now()->subDays(7))
            ->sum('quantity');
        $stockOut = \App\Models\ItemTransaction::where('type', 'out')
            ->where('created_at', '>=', now()->subDays(7))
            ->sum('quantity');

        // Low stock items (stock < 5)
        $lowStockItems = \App\Models\Item::where('stock', '<', 5)->count();

        // Monthly transaction chart data (last 6 months, ending in current month e.g. July)
        $monthlyData = [];
        $baseDate = now();
        for ($i = 5; $i >= 0; $i--) {
            $month = (clone $baseDate)->subMonths($i);
            $monthlyData[] = [
                'label' => $month->format('M'),
                'in' => \App\Models\ItemTransaction::where('type', 'in')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('quantity'),
                'out' => \App\Models\ItemTransaction::where('type', 'out')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('quantity'),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalItems' => $totalItems,
                'totalStock' => $totalStock,
                'totalUsers' => $totalUsers,
                'stockIn' => $stockIn,
                'stockOut' => $stockOut,
                'lowStockItems' => $lowStockItems,
            ],
            'recentLogs' => $recentLogs,
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
