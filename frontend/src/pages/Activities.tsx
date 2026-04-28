import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { activityService } from '../services/activityService';
import { Activity, Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const TYPE_LABELS: Record<string, string> = {
  қоңырау: '📞 Қоңырау',
  кездесу: '🤝 Кездесу',
  хат: '✉️ Хат',
  тапсырма: '✅ Тапсырма',
  басқа: '📌 Басқа',
};

const STATUS_LABELS: Record<string, string> = {
  жоспарланған: 'Жоспарланған',
  аяқталған: 'Аяқталған',
  болдырылмаған: 'Болдырылмаған',
};

const STATUS_CLASSES: Record<string, string> = {
  жоспарланған: 'bg-blue-50 text-blue-700',
  аяқталған: 'bg-green-50 text-green-700',
  болдырылмаған: 'bg-red-50 text-red-700',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  жоспарланған: <Clock className="h-4 w-4" />,
  аяқталған: <CheckCircle className="h-4 w-4" />,
  болдырылмаған: <XCircle className="h-4 w-4" />,
};

const getClientName = (client: Activity['клиент']) => {
  if (!client) return '—';
  if (typeof client === 'string') return client;
  return (client as Client).аты || '—';
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const LIMIT = 10;

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await activityService.getActivities({
        page,
        limit: LIMIT,
        түрі: typeFilter || undefined,
        статус: statusFilter || undefined,
        іздеу: search || undefined,
      });
      setActivities(res.data);
      setTotalPages(res.pages);
      setTotal(res.total);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchActivities, 300);
    return () => clearTimeout(timer);
  }, [fetchActivities]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`«${title}» іс-әрекетін жою керек пе?`)) return;
    setDeleting(id);
    try {
      await activityService.deleteActivity(id);
      fetchActivities();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Іс-әрекеттер</h1>
          <p className="text-sm text-gray-500 mt-0.5">Барлығы: {total} іс-әрекет</p>
        </div>
        <Link
          to="/activities/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Жаңа іс-әрекет
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
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
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Барлық түр</option>
            <option value="қоңырау">Қоңырау</option>
            <option value="кездесу">Кездесу</option>
            <option value="хат">Хат</option>
            <option value="тапсырма">Тапсырма</option>
            <option value="басқа">Басқа</option>
          </select>
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Барлық статус</option>
            <option value="жоспарланған">Жоспарланған</option>
            <option value="аяқталған">Аяқталған</option>
            <option value="болдырылмаған">Болдырылмаған</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : activities.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">Іс-әрекеттер табылмады</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  {['Тақырып', 'Түрі', 'Клиент', 'Күні', 'Статус', 'Іс-шаралар'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{activity.тақырып}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {TYPE_LABELS[activity.түрі] || activity.түрі}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getClientName(activity.клиент)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {activity.күні ? new Date(activity.күні).toLocaleDateString('kk-KZ') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[activity.статус] || ''}`}>
                        {STATUS_ICONS[activity.статус]}
                        {STATUS_LABELS[activity.статус] || activity.статус}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/activities/${activity._id}/edit`}
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Өзгерту
                        </Link>
                        <button
                          onClick={() => handleDelete(activity._id, activity.тақырып)}
                          disabled={deleting === activity._id}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30">←</button>
              <span className="text-sm text-gray-600">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30">→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
