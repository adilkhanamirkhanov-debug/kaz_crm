import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { activityService } from '../services/activityService';
import { clientService } from '../services/clientService';
import { Activity, Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

type ActivityFormData = {
  тақырып: string;
  түрі: Activity['түрі'];
  сипаттамасы?: string;
  клиент?: string;
  күні: string;
  статус: Activity['статус'];
};

export default function ActivityForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>({
    defaultValues: {
      түрі: 'тапсырма',
      статус: 'жоспарланған',
      күні: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    clientService.getClients({ limit: 200 }).then((res) => setClients(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    activityService.getActivityById(id)
      .then((activity) => {
        reset({
          тақырып: activity.тақырып,
          түрі: activity.түрі,
          сипаттамасы: activity.сипаттамасы,
          клиент: typeof activity.клиент === 'string' ? activity.клиент : (activity.клиент as Client)?._id,
          күні: activity.күні?.split('T')[0] || new Date().toISOString().split('T')[0],
          статус: activity.статус,
        });
      })
      .catch(() => setError('Іс-әрекет мәліметтерін жүктеу қатесі'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ActivityFormData) => {
    setSaving(true);
    setError('');
    try {
      if (isEdit && id) {
        await activityService.updateActivity(id, data);
      } else {
        await activityService.createActivity(data as Omit<Activity, '_id' | 'createdAt' | 'updatedAt'>);
      }
      navigate('/activities');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Сақтау кезінде қате орын алды');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/activities" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Іс-әрекетті өзгерту' : 'Жаңа іс-әрекет қосу'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Тақырып <span className="text-red-500">*</span>
              </label>
              <input
                {...register('тақырып', { required: 'Тақырыпты енгізіңіз' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Іс-әрекет тақырыбы"
              />
              {errors.тақырып && <p className="mt-1 text-xs text-red-600">{errors.тақырып.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Түрі</label>
              <select
                {...register('түрі')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="қоңырау">📞 Қоңырау</option>
                <option value="кездесу">🤝 Кездесу</option>
                <option value="хат">✉️ Хат</option>
                <option value="тапсырма">✅ Тапсырма</option>
                <option value="басқа">📌 Басқа</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
              <select
                {...register('статус')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="жоспарланған">Жоспарланған</option>
                <option value="аяқталған">Аяқталған</option>
                <option value="болдырылмаған">Болдырылмаған</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Күні <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('күні', { required: 'Күнін енгізіңіз' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.күні && <p className="mt-1 text-xs text-red-600">{errors.күні.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Клиент</label>
              <select
                {...register('клиент')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="">Клиент таңдаңыз</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.аты}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Сипаттамасы</label>
            <textarea
              {...register('сипаттамасы')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Іс-әрекет сипаттамасы..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/activities" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Бас тарту
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
              Сақтау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
