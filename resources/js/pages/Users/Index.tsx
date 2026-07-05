import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Plus, Shield, ShieldAlert, Trash2, Pencil } from 'lucide-react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
];

export default function UsersIndex({ users }: { users: any }) {
    const { auth } = usePage<any>().props;

    const deleteUser = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management – IMS" />
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users size={24} className="text-sky-400" /> User Management
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Manage admin accounts and permissions</p>
                    </div>
                    <Link href="/users/create" className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 transition text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/30">
                        <Plus size={16} /> New Admin
                    </Link>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-slate-500">No users found.</td>
                                    </tr>
                                ) : users.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium">{user.name}</span>
                                                {user.id === auth.user.id && (
                                                    <span className="text-xs bg-white/10 text-slate-400 px-1.5 py-0.5 rounded">you</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-400">{user.email}</td>
                                        <td className="px-5 py-4">
                                            {user.role === 'superadmin' ? (
                                                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border bg-violet-500/20 text-violet-300 border-violet-500/30 w-fit">
                                                    <ShieldAlert size={11} /> Super Admin
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border bg-sky-500/20 text-sky-300 border-sky-500/30 w-fit">
                                                    <Shield size={11} /> Admin
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                >
                                                    <Pencil size={10} /> Edit
                                                </Link>
                                                {auth.user.id !== user.id && (
                                                    <button
                                                        onClick={() => deleteUser(user.id, user.name)}
                                                        className="flex items-center gap-1 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                    >
                                                        <Trash2 size={10} /> Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                        {users.links.map((link: any, idx: number) => (
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                        link.active
                                            ? 'bg-sky-600 text-white shadow shadow-sky-500/40'
                                            : 'bg-white/10 text-slate-400 hover:bg-white/20'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-slate-600 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
