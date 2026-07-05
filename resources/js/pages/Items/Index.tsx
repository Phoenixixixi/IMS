import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Package, Plus, TrendingUp, TrendingDown, X, AlertTriangle, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Items', href: '/items' },
];

export default function ItemsIndex({ items }: { items: any }) {
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [transactionType, setTransactionType] = useState('in');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [search, setSearch] = useState('');

    const deleteItem = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/items/${id}`);
        }
    };

    const openModal = (item: any, type: string) => {
        setSelectedItem(item);
        setTransactionType(type);
        setQuantity(1);
        setNotes('');
    };

    const submitTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/items/${selectedItem.id}/transactions`, {
            type: transactionType,
            quantity,
            notes,
        }, {
            onSuccess: () => setSelectedItem(null),
        });
    };

    const filtered = items.data.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const stockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', cls: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (stock < 5)  return { label: 'Low Stock',    cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return                  { label: 'In Stock',     cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items – IMS" />
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Package size={24} className="text-indigo-400" /> Item Management
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Manage your warehouse inventory</p>
                    </div>
                    <Link href="/items/create" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                        <Plus size={16} /> Add Item
                    </Link>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Table Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                            No items found. <Link href="/items/create" className="text-indigo-400 hover:underline">Add one?</Link>
                                        </td>
                                    </tr>
                                ) : filtered.map((item: any) => {
                                    const status = stockStatus(item.stock);
                                    return (
                                        <tr key={item.id} className="hover:bg-white/5 transition group">
                                            <td className="px-5 py-4">
                                                <span className="font-mono text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">{item.sku}</span>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                                            <td className="px-5 py-4 text-slate-400 max-w-xs truncate">{item.description || <span className="text-slate-600 italic">—</span>}</td>
                                            <td className="px-5 py-4">
                                                <span className="text-lg font-bold text-white">{item.stock}</span>
                                                {item.stock < 5 && item.stock > 0 && (
                                                    <AlertTriangle size={12} className="inline ml-1.5 text-amber-400" />
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${status.cls}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openModal(item, 'in')}
                                                        className="flex items-center gap-1 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                    >
                                                        <TrendingUp size={11} /> In
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(item, 'out')}
                                                        className="flex items-center gap-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                    >
                                                        <TrendingDown size={11} /> Out
                                                    </button>
                                                    <Link
                                                        href={`/items/${item.id}/edit`}
                                                        className="text-xs bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteItem(item.id, item.name)}
                                                        className="text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 px-2.5 py-1.5 rounded-lg transition font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                        {items.links.map((link: any, idx: number) => (
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow shadow-indigo-500/40'
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

            {/* Transaction Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {transactionType === 'in' ? '📦 Stock In' : '📤 Stock Out'}
                                </h3>
                                <p className="text-sm text-slate-400 mt-0.5">{selectedItem.name} &middot; <span className="font-mono">{selectedItem.sku}</span></p>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="text-slate-500 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitTransaction} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Transaction Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['in', 'out'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTransactionType(t)}
                                            className={`py-2 rounded-lg text-sm font-semibold border transition ${
                                                transactionType === t
                                                    ? t === 'in'
                                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow shadow-emerald-500/30'
                                                        : 'bg-rose-600 border-rose-500 text-white shadow shadow-rose-500/30'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {t === 'in' ? '⬆ Stock In' : '⬇ Stock Out'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={quantity}
                                    onChange={e => setQuantity(parseInt(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                                {transactionType === 'out' && (
                                    <p className="text-xs text-slate-500 mt-1">Current stock: <span className="text-white font-semibold">{selectedItem.stock}</span></p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes <span className="text-slate-600 font-normal">(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. Received from supplier..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition shadow-lg ${
                                        transactionType === 'in'
                                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30'
                                            : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/30'
                                    }`}
                                >
                                    Confirm {transactionType === 'in' ? 'Stock In' : 'Stock Out'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedItem(null)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
