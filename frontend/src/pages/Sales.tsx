import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter, LayoutGrid, List } from 'lucide-react';
import { saleService } from '../services/saleService';
import { Sale, Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_LABELS: Record<string, string> = {
  жаңа: 'Жаңа',
  байланыс: 'Байланыс',
  ұсыныс: 'Ұсыныс',
  келіссөз: 'Келіссөз',
  жабық_жеңіс: 'Жабылды ✓',
  жабық_жеңіліс: 'Жабылды ✗',
};

const STATUS_COLORS: Record<string, string> = {
  жаңа: 'bg-gray-100 text-gray-700',
  байланыс: 'bg-blue-50 text-blue-700',
  ұсыныс: 'bg-yellow-50 text-yellow-700',
  келіссөз: 'bg-purple-50 text-purple-700',
  жабық_жеңіс: 'bg-green-50 text-green-700',
  жабық_жеңіліс: 'bg-red-50 text-red-700',
};

const PIPELINE_COLUMNS = [
  { key: 'жаңа', label: 'Жаңа', color: 'border-gray-300 bg-gray-50' },
  { key: 'байланыс', label: 'Байланыс', color: 'border-blue-300 bg-blue-50' },
  { key: 'ұсыныс', label: 'Ұсыныс', color: 'border-yellow-300 bg-yellow-50' },
  { key: 'келіссөз', label: 'Келіссөз', color: 'border-purple-300 bg-purple-50' },
  { key: 'жабық_жеңіс', label: 'Жабылды ✓', color: 'border-green-300 bg-green-50' },
  { key: 'жабық_жеңіліс', label: 'Жабылды ✗', color: 'border-red-300 bg-red-50' },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('kk-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(n);

const getClientName = (client: Sale['клиент']) => {
  if (!client) return '—';
  if (typeof client === 'string') return client;
  return (client as Client).аты || '—';
};

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [deleting, setDeleting] = useState<string | null>(null);
  const LIMIT = 10;

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await saleService.getSales({
        page: view === 'kanban' ? 1 : page,
        limit: view === 'kanban' ? 200 : LIMIT,
        статус: statusFilter || undefined,
        іздеу: search || undefined,
      });
      setSales(res.data);
      setTotalPages(res.pages);
      setTotal(res.total);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, view]);

  useEffect(() => {
    const timer = setTimeout(fetchSales, 300);
    return () => clearTimeout(timer);
  }, [fetchSales]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`«${title}» сатуын жою керек пе?`)) return;
    setDeleting(id);
    try {
      await saleService.deleteSale(id);
      fetchSales();
    } finally {
      setDeleting(null);
    }
  };

  const kanbanData = PIPELINE_COLUMNS.reduce((acc, col) => {
    acc[col.key] = sales.filter((s) => s.статус === col.key);
    return acc;
  }, {} as Record<string, Sale[]>);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Сатулар</h1>
          <p className="text-sm text-gray-500 mt-0.5">Барлығы: {total} сату</p>
        </div>
        <Link
          to="/sales/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Жаңа сату
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Іздеу..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Барлық статус</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`p-2 ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-2 ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : view === 'kanban' ? (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => (
            <div key={col.key} className={`flex-shrink-0 w-64 rounded-xl border ${col.color} p-3`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 font-medium text-gray-500 shadow-sm">
                  {kanbanData[col.key]?.length || 0}
                </span>
              </div>
              <div className="space-y-2">
                {kanbanData[col.key]?.map((sale) => (
                  <div key={sale._id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-gray-900 mb-1">{sale.тақырып}</p>
                    <p className="text-xs text-gray-500 mb-2">{getClientName(sale.клиент)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-700">{formatCurrency(sale.сомасы)}</span>
                      <span className="text-xs text-gray-400">{sale.мүмкіндік_пайызы}%</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Link
                        to={`/sales/${sale._id}/edit`}
                        className="flex-1 text-center rounded px-1.5 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                      >
                        Өзгерту
                      </Link>
                      <button
                        onClick={() => handleDelete(sale._id, sale.тақырып)}
                        className="flex-1 text-center rounded px-1.5 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Жою
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {sales.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-sm">Сатулар табылмады</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    {['Тақырып', 'Клиент', 'Сомасы', 'Статус', 'Мүмкіндік %', 'Іс-шаралар'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.тақырып}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{getClientName(sale.клиент)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-indigo-700">{formatCurrency(sale.сомасы)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[sale.статус] || ''}`}>
                          {STATUS_LABELS[sale.статус] || sale.статус}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${sale.мүмкіндік_пайызы}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{sale.мүмкіндік_пайызы}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/sales/${sale._id}/edit`}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Өзгерту
                          </Link>
                          <button
                            onClick={() => handleDelete(sale._id, sale.тақырып)}
                            disabled={deleting === sale._id}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Жою
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && view === 'list' && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">
                {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  ←
                </button>
                <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
