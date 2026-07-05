<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);
        return Inertia::render('Users/Index', ['users' => $users]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'superadmin'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Created User',
            'description' => "Created user: {$user->name} ({$user->email}) with role {$user->role}.",
        ]);

        return redirect()->route('users.index')->with('message', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'superadmin'])],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Updated User',
            'description' => "Updated user: {$user->name} ({$user->email}).",
        ]);

        return redirect()->route('users.index')->with('message', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['message' => 'You cannot delete yourself.']);
        }

        $name = $user->name;
        $user->delete();

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Deleted User',
            'description' => "Deleted user: {$name}.",
        ]);

        return redirect()->route('users.index')->with('message', 'User deleted successfully.');
    }
}
