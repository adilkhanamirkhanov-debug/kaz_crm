import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Phone, Mail, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { clientService } from '../services/clientService';
import { Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_LABELS: Record<string, string> = {
  белсенді: 'Белсенді',
  болашақ: 'Болашақ',
  бұрынғы: 'Бұрынғы',
};

const STATUS_CLASSES: Record<string, string> = {
  белсенді: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  болашақ: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  бұрынғы: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const LIMIT = 10;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientService.getClients({
        page,
        limit: LIMIT,
        статус: statusFilter || undefined,
        іздеу: search || undefined,
      });
      setClients(res.data);
      setTotalPages(res.pages);
      setTotal(res.total);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [fetchClients]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`«${name}» клиентін жою керек пе?`)) return;
    setDeleting(id);
    try {
      await clientService.deleteClient(id);
      fetchClients();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиенттер</h1>
          <p className="text-sm text-gray-500 mt-0.5">Барлығы: {total} клиент</p>
        </div>
        <Link
          to="/clients/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Жаңа клиент
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
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
          >
            <option value="">Барлық статус</option>
            <option value="белсенді">Белсенді</option>
            <option value="болашақ">Болашақ</option>
            <option value="бұрынғы">Бұрынғы</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : clients.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">Клиенттер табылмады</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  {['Аты', 'Компания', 'Телефон', 'Эл. пошта', 'Статус', 'Іс-шаралар'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-600 text-xs font-semibold">
                            {client.аты?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.аты}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.компания || '—'}</td>
                    <td className="px-4 py-3">
                      {client.телефон ? (
                        <a href={`tel:${client.телефон}`} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
                          <Phone className="h-3.5 w-3.5" /> {client.телефон}
                        </a>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {client.эл_пошта ? (
                        <a href={`mailto:${client.эл_пошта}`} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate max-w-32">{client.эл_пошта}</span>
                        </a>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[client.статус] || ''}`}>
                        {STATUS_LABELS[client.статус] || client.статус}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/clients/${client._id}/edit`}
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Өзгерту
                        </Link>
                        <button
                          onClick={() => handleDelete(client._id, client.аты)}
                          disabled={deleting === client._id}
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 rounded-md text-xs font-medium ${
                      p === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
