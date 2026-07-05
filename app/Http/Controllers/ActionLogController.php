<?php

namespace App\Http\Controllers;

use App\Models\ActionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActionLogController extends Controller
{
    public function index()
    {
        $logs = ActionLog::with('user:id,name')->latest()->paginate(15);
        return Inertia::render('Logs/Index', ['logs' => $logs]);
    }
}
