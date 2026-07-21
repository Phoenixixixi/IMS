import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Package, TrendingUp, TrendingDown, Users, AlertTriangle, Activity, ArrowRight, BarChart3 } from 'lucide-react';
import { DropdownMenuRadio } from '@/components/ui/dropdown';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface DashboardStats {
    totalItems: number;
    totalStock: number;
    totalUsers: number;
    stockIn: number;
    stockOut: number;
    lowStockItems: number;
}

interface RecentLog {
    id: number;
    action: string;
    description: string;
    created_at: string;
    user: { id: number; name: string } | null;
}

interface MonthlyData {
    label: string;
    in: number;
    out: number;
}

interface ItemOption {
    id: number;
    name: string;
}

interface Filters {
    item_id: number | null;
    month: number | null;
}

interface Props {
    items: ItemOption[];
    filters: Filters;
    stats: DashboardStats;
    recentLogs: RecentLog[];
    monthlyData: MonthlyData[];
}

// Pure SVG bar chart — no external library needed
function BarChart({ data }: { data: MonthlyData[] }) {
    const maxVal = Math.max(...data.flatMap(d => [d.in, d.out]), 1);
    const chartH = 160;
    const chartW = 480;
    const barW = 20;
    const gap = 8;
    const groupW = 70;
    const offsetX = 40;

    const yTicks = [0, 25, 50, 75, 100].map(p => Math.round((p / 100) * maxVal));



    return (
        <svg viewBox={`0 0 ${chartW} ${chartH + 48}`} className="w-full" aria-label="Monthly stock chart">
            {/* Y axis grid lines */}
            {yTicks.map((tick, i) => {
                const y = chartH - (tick / maxVal) * chartH;
                return (
                    <g key={i}>
                        <line x1={offsetX} y1={y} x2={chartW - 8} y2={y} stroke="rgba(148,163,184,0.25)" strokeDasharray="4 3" />
                        <text x={offsetX - 6} y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{tick}</text>
                    </g>
                );
            })}

            {/* Bars */}
            {data.map((d, i) => {
                const x = offsetX + i * groupW;
                const inH = (d.in / maxVal) * chartH;
                const outH = (d.out / maxVal) * chartH;
                return (
                    <g key={i}>
                        {/* Stock In bar */}
                        <rect
                            x={x}
                            y={chartH - inH}
                            width={barW}
                            height={inH || 2}
                            rx={4}
                            fill="url(#greenGrad)"
                        />
                        {/* Stock Out bar */}
                        <rect
                            x={x + barW + gap}
                            y={chartH - outH}
                            width={barW}
                            height={outH || 2}
                            rx={4}
                            fill="url(#redGrad)"
                        />
                        {/* Month label */}
                        <text x={x + barW + gap / 2} y={chartH + 16} fontSize="10" fill="#94a3b8" textAnchor="middle">{d.label}</text>
                    </g>
                );
            })}

            {/* Legend */}
            <circle cx={offsetX} cy={chartH + 36} r={5} fill="url(#greenGrad)" />
            <text x={offsetX + 10} y={chartH + 40} fontSize="10" fill="#94a3b8">Stock In</text>
            <circle cx={offsetX + 80} cy={chartH + 36} r={5} fill="url(#redGrad)" />
            <text x={offsetX + 90} y={chartH + 40} fontSize="10" fill="#94a3b8">Stock Out</text>

            {/* Gradients */}
            <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// Donut / ring chart for stock composition
function DonutChart({ stockIn, stockOut }: { stockIn: number; stockOut: number }) {
    const total = stockIn + stockOut || 1;
    const inPct = (stockIn / total) * 100;
    const outPct = (stockOut / total) * 100;

    const r = 52;
    const cx = 70;
    const cy = 70;
    const circ = 2 * Math.PI * r;

    const inDash = (inPct / 100) * circ;
    const outOffset = inDash;

    return (
        <div className="relative flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background ring */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="16" />
                {/* Stock In arc */}
                {stockIn > 0 && (
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="url(#donutGreen)"
                        strokeWidth="16"
                        strokeDasharray={`${inDash} ${circ - inDash}`}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${cx} ${cy})`}
                    />
                )}
                {/* Stock Out arc */}
                {stockOut > 0 && (
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="url(#donutRed)"
                        strokeWidth="16"
                        strokeDasharray={`${(outPct / 100) * circ} ${circ - (outPct / 100) * circ}`}
                        strokeLinecap="round"
                        transform={`rotate(${-90 + (inPct / 100) * 360} ${cx} ${cy})`}
                        opacity={0.8}
                    />
                )}
                <defs>
                    <linearGradient id="donutGreen" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="donutRed" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fca5a5" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{Math.round(inPct)}%</span>
                <span className="text-xs text-slate-400">In ratio</span>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, sub, accent }: {
    icon: any;
    label: string;
    value: string | number;
    sub?: string;
    accent: string;
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex items-start gap-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${accent} flex items-center justify-center shadow-md`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
                {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
            </div>
            {/* Decorative glow */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${accent} opacity-10 blur-2xl`} />
        </div>
    );
}

function actionColor(action: string): string {
    if (action.toLowerCase().includes('delete')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (action.toLowerCase().includes('create')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (action.toLowerCase().includes('update')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (action.toLowerCase().includes('transaction')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
}

export default function Dashboard({ items, filters, stats, recentLogs, monthlyData }: Props) {
    const monthOptions = [
        { value: '1',  label: 'January' },
        { value: '2',  label: 'February' },
        { value: '3',  label: 'March' },
        { value: '4',  label: 'April' },
        { value: '5',  label: 'May' },
        { value: '6',  label: 'June' },
        { value: '7',  label: 'July' },
        { value: '8',  label: 'August' },
        { value: '9',  label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const itemOptions = items.map(i => ({ value: String(i.id), label: i.name }));

    function applyFilter(key: 'item_id' | 'month', value: string | null) {
        router.get('/dashboard', {
            item_id: key === 'item_id' ? value : (filters.item_id ?? undefined),
            month:   key === 'month'   ? value : (filters.month   ?? undefined),
        } as Record<string, string | number | undefined>, { preserveScroll: true, preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard – IMS" />

            {/* Full-page gradient background */}
            <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">

                {/* === HERO HEADER === */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 shadow-2xl">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-12 -left-8 w-52 h-52 bg-white/5 rounded-full blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <BarChart3 size={20} className="text-white" />
                                </div>
                                <span className="text-white/80 text-sm font-medium tracking-widest uppercase">Inventory Management System</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                Welcome back! 👋
                            </h1>
                            <p className="text-white/70 mt-1 text-sm">
                                Here's a real-time overview of your warehouse operations.
                            </p>
                        </div>
                        <Link
                            href="/items"
                            className="flex items-center gap-2 self-start md:self-auto bg-white/20 hover:bg-white/30 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl backdrop-blur-sm border border-white/30"
                        >
                            Manage Items <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* === STAT CARDS === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard icon={Package} label="Total SKUs" value={stats.totalItems} sub="Unique products in system" accent="bg-indigo-500" />
                    <StatCard icon={Activity} label="Total Stock" value={stats.totalStock} sub="Units across all items" accent="bg-violet-500" />
                    <StatCard icon={Users} label="System Users" value={stats.totalUsers} sub="Active accounts" accent="bg-sky-500" />
                    <StatCard icon={TrendingUp} label="Stock In (7d)" value={stats.stockIn} sub="Units received this week" accent="bg-emerald-500" />
                    <StatCard icon={TrendingDown} label="Stock Out (7d)" value={stats.stockOut} sub="Units dispatched this week" accent="bg-rose-500" />
                    <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.lowStockItems} sub="Items with fewer than 5 units" accent="bg-amber-500" />
                </div>

                {/* === FILTERS === */}
                <div className="grid grid-cols-2 w-full gap-3">
                    <DropdownMenuRadio
                        title="Filter by Item"
                        placeholder="All Items"
                        data={itemOptions}
                        value={filters.item_id ? String(filters.item_id) : undefined}
                        onValueChange={(val) => applyFilter('item_id', val)}
                    />
                    <DropdownMenuRadio
                        title="Filter by Month"
                        placeholder="All Months"
                        data={monthOptions}
                        value={filters.month ? String(filters.month) : undefined}
                        onValueChange={(val) => applyFilter('month', val)}
                    />
                </div>

                {/* === CHARTS ROW === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart — 2/3 width */}
                    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-base font-semibold text-white">Monthly Transactions</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Stock In vs. Stock Out — last 6 months</p>
                            </div>
                            <BarChart3 size={18} className="text-slate-500" />
                        </div>
                        <BarChart data={monthlyData} />
                    </div>

                    {/* Donut Chart — 1/3 width */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg flex flex-col items-center justify-center gap-4">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-white">7-Day Flow</h2>
                            <p className="text-xs text-slate-400 mt-0.5">In vs. Out ratio</p>
                        </div>
                        <DonutChart stockIn={stats.stockIn} stockOut={stats.stockOut} />
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Stock In
                                </span>
                                <span className="text-white font-semibold">{stats.stockIn} units</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Stock Out
                                </span>
                                <span className="text-white font-semibold">{stats.stockOut} units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RECENT ACTIVITY === */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Latest actions recorded in the system</p>
                        </div>
                        <Link href="/logs" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No activity yet. Start by adding items!</div>
                    ) : (
                        <div className="space-y-3">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border whitespace-nowrap ${actionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-300 truncate">{log.description}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {log.user?.name ?? 'System'} &middot; {new Date(log.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
