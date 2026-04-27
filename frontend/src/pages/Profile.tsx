import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, User, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

interface ProfileForm {
  аты: string;
  эл_пошта: string;
  құпия_сөз?: string;
  жаңа_құпия_сөз?: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      аты: user?.аты || '',
      эл_пошта: user?.эл_пошта || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: any = { аты: data.аты, эл_пошта: data.эл_пошта };
      if (data.жаңа_құпия_сөз) {
        payload.құпия_сөз = data.жаңа_құпия_сөз;
      }
      const updated = await authService.updateProfile(payload);
      updateUser(updated);
      setSuccess('Профиль сәтті жаңартылды');
      reset({ аты: updated.аты, эл_пошта: updated.эл_пошта, құпия_сөз: '', жаңа_құпия_сөз: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Жаңарту кезінде қате орын алды');
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = user?.рөлі === 'admin' ? 'Әкімші' : user?.рөлі === 'manager' ? 'Менеджер' : 'Қолданушы';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 text-2xl font-bold">
              {user?.аты?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.аты}</h2>
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
              <Mail className="h-4 w-4" /> {user?.эл_пошта}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700">
                <Shield className="h-3.5 w-3.5" /> {roleLabel}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${user?.белсенді ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {user?.белсенді ? 'Белсенді' : 'Белсенді емес'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-5">Профильді өзгерту</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Аты-жөні <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('аты', { required: 'Атыңызды енгізіңіз' })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.аты && <p className="mt-1 text-xs text-red-600">{errors.аты.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Электрондық пошта <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...register('эл_пошта', {
                    required: 'Электрондық поштаны енгізіңіз',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Жарамды пошта мекенжайын енгізіңіз' },
                  })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.эл_пошта && <p className="mt-1 text-xs text-red-600">{errors.эл_пошта.message}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Құпия сөзді өзгерту (міндетті емес)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Жаңа құпия сөз</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('жаңа_құпия_сөз', {
                      minLength: { value: 6, message: 'Кемінде 6 символ болуы керек' },
                    })}
                    className="w-full pr-10 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.жаңа_құпия_сөз && <p className="mt-1 text-xs text-red-600">{errors.жаңа_құпия_сөз.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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
