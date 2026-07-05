import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Users, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Create User', href: '/users/create' },
];

const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User – IMS" />
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href="/users" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-slate-400 hover:text-white">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users size={20} className="text-sky-400" /> Create New Admin
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">Add a new user to the system</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
                        <form onSubmit={submit} className="space-y-5">
                            <Field label="Full Name" error={errors.name}>
                                <input type="text" className={inputCls} placeholder="e.g. John Doe" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            </Field>
                            <Field label="Email Address" error={errors.email}>
                                <input type="email" className={inputCls} placeholder="e.g. john@example.com" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            </Field>
                            <Field label="Role" error={errors.role}>
                                <div className="grid grid-cols-2 gap-2">
                                    {['admin', 'superadmin'].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setData('role', r)}
                                            className={`py-2 rounded-xl text-sm font-semibold border transition ${
                                                data.role === r
                                                    ? 'bg-sky-600 border-sky-500 text-white shadow shadow-sky-500/30'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {r === 'admin' ? '🛡 Admin' : '⚡ Super Admin'}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                            <Field label="Password" error={errors.password}>
                                <input type="password" className={inputCls} placeholder="Min. 8 characters" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            </Field>
                            <Field label="Confirm Password">
                                <input type="password" className={inputCls} placeholder="Repeat password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                            </Field>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-60 transition shadow-lg shadow-sky-500/30">
                                    {processing ? 'Creating...' : 'Create User'}
                                </button>
                                <Link href="/users" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
