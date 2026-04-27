import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { clientService } from '../services/clientService';
import { Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

type ClientFormData = Omit<Client, '_id' | 'createdAt' | 'updatedAt' | 'жауапты_менеджер'>;

export default function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    defaultValues: { статус: 'белсенді' },
  });

  useEffect(() => {
    if (!isEdit || !id) return;
    clientService.getClientById(id)
      .then((client) => {
        reset({
          аты: client.аты,
          эл_пошта: client.эл_пошта,
          телефон: client.телефон,
          компания: client.компания,
          мекен_жай: client.мекен_жай,
          статус: client.статус,
          ескертпелер: client.ескертпелер,
        });
      })
      .catch(() => setError('Клиент мәліметтерін жүктеу қатесі'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true);
    setError('');
    try {
      if (isEdit && id) {
        await clientService.updateClient(id, data);
      } else {
        await clientService.createClient(data as Omit<Client, '_id' | 'createdAt' | 'updatedAt'>);
      }
      navigate('/clients');
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
        <Link to="/clients" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Клиентті өзгерту' : 'Жаңа клиент қосу'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Аты-жөні <span className="text-red-500">*</span>
              </label>
              <input
                {...register('аты', { required: 'Атын енгізіңіз' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Клиент аты-жөні"
              />
              {errors.аты && <p className="mt-1 text-xs text-red-600">{errors.аты.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Электрондық пошта <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('эл_пошта', {
                  required: 'Электрондық поштаны енгізіңіз',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Жарамды пошта мекенжайын енгізіңіз' },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="email@example.com"
              />
              {errors.эл_пошта && <p className="mt-1 text-xs text-red-600">{errors.эл_пошта.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
              <input
                {...register('телефон')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+7 (777) 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Компания</label>
              <input
                {...register('компания')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Компания атауы"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Мекен-жай</label>
              <input
                {...register('мекен_жай')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Клиент мекен-жайы"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
              <select
                {...register('статус')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="белсенді">Белсенді</option>
                <option value="болашақ">Болашақ</option>
                <option value="бұрынғы">Бұрынғы</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ескертпелер</label>
            <textarea
              {...register('ескертпелер')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Қосымша ескертпелер..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/clients"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Бас тарту
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Сақтау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
