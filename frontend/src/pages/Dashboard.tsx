import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, TrendingUp, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { DashboardStats, Activity } from '../types';
import api from '../services/api';

const STATUS_COLORS: Record<string, string> = {
  жаңа: '#6366f1',
  байланыс: '#3b82f6',
  ұсыныс: '#f59e0b',
  келіссөз: '#8b5cf6',
  жабық_жеңіс: '#10b981',
  жабық_жеңіліс: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  жаңа: 'Жаңа',
  байланыс: 'Байланыс',
  ұсыныс: 'Ұсыныс',
  келіссөз: 'Келіссөз',
  жабық_жеңіс: 'Жабылды (жеңіс)',
  жабық_жеңіліс: 'Жабылды (жеңіліс)',
};

const ACTIVITY_STATUS_ICON: Record<string, React.ReactNode> = {
  жоспарланған: <Clock className="h-4 w-4 text-blue-500" />,
  аяқталған: <CheckCircle className="h-4 w-4 text-green-500" />,
  болдырылмаған: <XCircle className="h-4 w-4 text-red-500" />,
};

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  қоңырау: '📞 Қоңырау',
  кездесу: '🤝 Кездесу',
  хат: '✉️ Хат',
  тапсырма: '✅ Тапсырма',
  басқа: '📌 Басқа',
};

const mockMonthData = [
  { ай: 'Қаң', сомасы: 0 },
  { ай: 'Ақп', сомасы: 0 },
  { ай: 'Нау', сомасы: 0 },
  { ай: 'Сәу', сомасы: 0 },
  { ай: 'Мам', сомасы: 0 },
  { ай: 'Мау', сомасы: 0 },
  { ай: 'Шіл', сомасы: 0 },
  { ай: 'Там', сомасы: 0 },
  { ай: 'Қыр', сомасы: 0 },
  { ай: 'Қаз', сомасы: 0 },
  { ай: 'Қар', сомасы: 0 },
  { ай: 'Жел', сомасы: 0 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get<DashboardStats>('/dashboard/stats'),
          api.get<{ data: Activity[] }>('/activities?limit=5&sort=-күні'),
        ]);
        setStats(statsRes.data);
        setRecentActivities(activitiesRes.data?.data || []);
      } catch {
        // fallback defaults
        setStats({
          клиент_саны: 0,
          сату_саны: 0,
          іс_әрекет_саны: 0,
          жалпы_түсім: 0,
          статус_бойынша_сату: {},
          ай_бойынша_сату: mockMonthData,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const monthData = stats?.ай_бойынша_сату?.length ? stats.ай_бойынша_сату : mockMonthData;

  const pieData = Object.entries(stats?.статус_бойынша_сату || {}).map(([key, val]) => ({
    name: STATUS_LABELS[key] || key,
    value: val,
    color: STATUS_COLORS[key] || '#94a3b8',
  }));

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('kk-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Басты бет</h1>
        <div className="flex gap-2">
          <Link
            to="/clients/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Клиент қосу
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Барлық клиенттер"
          value={stats?.клиент_саны ?? 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Белсенді сатулар"
          value={stats?.сату_саны ?? 0}
          icon={Briefcase}
          color="purple"
        />
        <StatsCard
          title="Іс-әрекеттер"
          value={stats?.іс_әрекет_саны ?? 0}
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          title="Жалпы түсім"
          value={formatCurrency(stats?.жалпы_түсім ?? 0)}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Ай бойынша сатулар (₸)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ай" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="сомасы" fill="#6366f1" radius={[4, 4, 0, 0]} name="Сомасы" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Статус бойынша сатулар</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
              Мәліметтер жоқ
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Соңғы іс-әрекеттер</h2>
          <Link to="/activities" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Барлығын көру →
          </Link>
        </div>
        {recentActivities.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {recentActivities.map((activity) => (
              <li key={activity._id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex-shrink-0">
                  {ACTIVITY_STATUS_ICON[activity.статус] || <Clock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.тақырып}</p>
                  <p className="text-xs text-gray-500">
                    {ACTIVITY_TYPE_LABELS[activity.түрі] || activity.түрі} •{' '}
                    {activity.күні ? new Date(activity.күні).toLocaleDateString('kk-KZ') : '—'}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    activity.статус === 'аяқталған'
                      ? 'bg-green-50 text-green-700'
                      : activity.статус === 'жоспарланған'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {activity.статус === 'аяқталған' ? 'Аяқталған' : activity.статус === 'жоспарланған' ? 'Жоспарланған' : 'Болдырылмаған'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Іс-әрекеттер жоқ</p>
          </div>
        )}
      </div>
    </div>
  );
}
