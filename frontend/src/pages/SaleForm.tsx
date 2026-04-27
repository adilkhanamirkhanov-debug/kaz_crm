import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { saleService } from '../services/saleService';
import { clientService } from '../services/clientService';
import { Sale, Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

type SaleFormData = {
  тақырып: string;
  клиент: string;
  сомасы: number;
  статус: Sale['статус'];
  мүмкіндік_пайызы: number;
  болжамды_жабылу?: string;
  ескертпелер?: string;
};

export default function SaleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SaleFormData>({
    defaultValues: { статус: 'жаңа', мүмкіндік_пайызы: 50, сомасы: 0 },
  });

  useEffect(() => {
    clientService.getClients({ limit: 200 }).then((res) => setClients(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    saleService.getSaleById(id)
      .then((sale) => {
        reset({
          тақырып: sale.тақырып,
          клиент: typeof sale.клиент === 'string' ? sale.клиент : (sale.клиент as Client)?._id,
          сомасы: sale.сомасы,
          статус: sale.статус,
          мүмкіндік_пайызы: sale.мүмкіндік_пайызы,
          болжамды_жабылу: sale.болжамды_жабылу?.split('T')[0],
          ескертпелер: sale.ескертпелер,
        });
      })
      .catch(() => setError('Сату мәліметтерін жүктеу қатесі'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data: SaleFormData) => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...data, сомасы: Number(data.сомасы), мүмкіндік_пайызы: Number(data.мүмкіндік_пайызы) };
      if (isEdit && id) {
        await saleService.updateSale(id, payload);
      } else {
        await saleService.createSale(payload as any);
      }
      navigate('/sales');
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
        <Link to="/sales" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Сатуды өзгерту' : 'Жаңа сату қосу'}
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
                placeholder="Сату тақырыбы"
              />
              {errors.тақырып && <p className="mt-1 text-xs text-red-600">{errors.тақырып.message}</p>}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Сомасы (₸) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                {...register('сомасы', { required: 'Сомасын енгізіңіз', min: { value: 0, message: 'Сомасы 0-ден кем болмауы керек' } })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
              {errors.сомасы && <p className="mt-1 text-xs text-red-600">{errors.сомасы.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
              <select
                {...register('статус')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="жаңа">Жаңа</option>
                <option value="байланыс">Байланыс</option>
                <option value="ұсыныс">Ұсыныс</option>
                <option value="келіссөз">Келіссөз</option>
                <option value="жабық_жеңіс">Жабылды (жеңіс)</option>
                <option value="жабық_жеңіліс">Жабылды (жеңіліс)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Мүмкіндік пайызы (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('мүмкіндік_пайызы', {
                  min: { value: 0, message: '0-ден кем болмауы керек' },
                  max: { value: 100, message: '100-ден асып кетпеуі керек' },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.мүмкіндік_пайызы && <p className="mt-1 text-xs text-red-600">{errors.мүмкіндік_пайызы.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Болжамды жабылу күні</label>
              <input
                type="date"
                {...register('болжамды_жабылу')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ескертпелер</label>
            <textarea
              {...register('ескертпелер')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Қосымша ескертпелер..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/sales" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
