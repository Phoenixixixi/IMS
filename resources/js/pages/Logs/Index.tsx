import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Activity Logs', href: '/logs' },
];

function actionBadge(action: string) {
    if (action.toLowerCase().includes('delete')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (action.toLowerCase().includes('create')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (action.toLowerCase().includes('update')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (action.toLowerCase().includes('transaction')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
}

function actionDot(action: string) {
    if (action.toLowerCase().includes('delete')) return 'bg-red-400';
    if (action.toLowerCase().includes('create')) return 'bg-emerald-400';
    if (action.toLowerCase().includes('update')) return 'bg-blue-400';
    if (action.toLowerCase().includes('transaction')) return 'bg-amber-400';
    return 'bg-slate-400';
}

export default function LogsIndex({ logs }: { logs: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs – IMS" />
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Activity size={24} className="text-violet-400" /> Activity Logs
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">A chronological record of all system actions</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-slate-500">No logs recorded yet.</td>
                                    </tr>
                                ) : logs.data.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition">
                                        <td className="px-5 py-4">
                                            <span className="text-slate-400 text-xs font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${actionDot(log.action)}`} />
                                                <span className="text-white text-sm font-medium">{log.user?.name ?? 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${actionBadge(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-300 max-w-md">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                        {logs.links.map((link: any, idx: number) => (
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                                        link.active
                                            ? 'bg-violet-600 text-white shadow shadow-violet-500/40'
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
