import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  эл_пошта: string;
  құпия_сөз: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(data.эл_пошта, data.құпия_сөз);
      login(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Кіру кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-indigo-600 items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">CRM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Қазақ CRM</h1>
          <p className="text-gray-500 mt-1">Жүйеге кіріңіз</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Электрондық пошта
              </label>
              <input
                type="email"
                {...register('эл_пошта', {
                  required: 'Электрондық поштаны енгізіңіз',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Жарамды пошта мекенжайын енгізіңіз' },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="email@example.com"
              />
              {errors.эл_пошта && (
                <p className="mt-1 text-xs text-red-600">{errors.эл_пошта.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Құпия сөз
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('құпия_сөз', { required: 'Құпия сөзді енгізіңіз' })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              {errors.құпия_сөз && (
                <p className="mt-1 text-xs text-red-600">{errors.құпия_сөз.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              Кіру
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Тіркелмедіңіз бе?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Тіркелу
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
