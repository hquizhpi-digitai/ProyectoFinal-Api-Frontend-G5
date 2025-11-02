import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import ErrorMessage from '../../../shared/components/feedback/ErrorMessage';
import SuccessMessage from '../../../shared/components/feedback/SuccessMessage';

const loginSchema = z.object({
  email: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setSuccessMessage(null);
    const result = await login(data);

    if (result.success) {
      // Mostrar mensaje de bienvenida
      // Usar el email del formulario ya que user puede no estar actualizado inmediatamente
      const userName = data.email || 'Usuario';
      setSuccessMessage(`¡Bienvenido, ${userName}!`);
      
      // Redirigir después de mostrar el mensaje brevemente (2 segundos para que sea visible)
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-600 opacity-10 blur-2xl rounded-full"></div>
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 text-center">Ministerio de Gobierno</h1>
          <p className="text-slate-600 mt-3 text-center">Sistema de Gestión Ciudadana</p>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}
        {successMessage && <SuccessMessage message={successMessage} className="mb-6" />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Usuario"
            type="text"
            placeholder="Ingrese su usuario"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Card>
    </div>
  );
}
