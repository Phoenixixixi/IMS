import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Package, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Items', href: '/items' },
    { title: 'Create Item', href: '/items/create' },
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
            {children}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

export default function CreateItem() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        description: '',
        stock: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Item – IMS" />
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                <div className="max-w-2xl mx-auto space-y-6">

                    <div className="flex items-center gap-3">
                        <Link href="/items" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-slate-400 hover:text-white">
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                <Package size={20} className="text-indigo-400" /> Add New Item
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">Fill in the details below to register a new item</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
                        <form onSubmit={submit} className="space-y-5">
                            <Field label="Item Name" error={errors.name}>
                                <input type="text" className={inputCls} placeholder="e.g. Cardboard Box A4" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            </Field>
                            <Field label="SKU Code" error={errors.sku}>
                                <input type="text" className={inputCls} placeholder="e.g. BOX-A4-001" value={data.sku} onChange={e => setData('sku', e.target.value)} required />
                            </Field>
                            <Field label="Description" error={errors.description}>
                                <textarea rows={3} className={inputCls} placeholder="Optional description..." value={data.description} onChange={e => setData('description', e.target.value)} />
                            </Field>
                            <Field label="Initial Stock" error={errors.stock}>
                                <input type="number" min="0" className={inputCls} value={data.stock} onChange={e => setData('stock', parseInt(e.target.value))} required />
                            </Field>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition shadow-lg shadow-indigo-500/30">
                                    {processing ? 'Saving...' : 'Save Item'}
                                </button>
                                <Link href="/items" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition">
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
