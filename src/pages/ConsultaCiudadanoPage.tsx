import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, CheckCircle, XCircle } from 'lucide-react';
import { useConsultaCiudadano } from '../features/dinardap/hooks/useConsultaCiudadano';
import Button from '../shared/components/ui/Button';
import Input from '../shared/components/ui/Input';
import Card from '../shared/components/ui/Card';
import ErrorMessage from '../shared/components/feedback/ErrorMessage';
import Loading from '../shared/components/feedback/Loading';

const consultaSchema = z.object({
  cedula: z.string().min(1, 'La cédula es requerida'),
});

type ConsultaFormData = z.infer<typeof consultaSchema>;

export default function ConsultaCiudadanoPage() {
  const { citizen, isLoading, error, consultar, reset } = useConsultaCiudadano();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
  });

  const onSubmit = async (data: ConsultaFormData) => {
    await consultar(data.cedula);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Consulta de Ciudadano</h1>
        <p className="text-slate-600">Busque información de un ciudadano por su número de cédula</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Buscar Ciudadano</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Número de Cédula"
            placeholder="Ej: 0928239235"
            error={errors.cedula?.message}
            {...register('cedula')}
          />

          {error && <ErrorMessage message={error} />}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            >
              Consultar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={isLoading}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Loading />}

      {!isLoading && citizen && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-slate-900">Información del Ciudadano</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Cédula</label>
              <p className="text-lg font-semibold text-slate-900">{citizen.cedula}</p>
            </div>

            {citizen.nombre && (
              <div>
                <label className="text-sm font-medium text-slate-600">Nombre</label>
                <p className="text-lg font-semibold text-slate-900">{citizen.nombre}</p>
              </div>
            )}

            {citizen.apellido && (
              <div>
                <label className="text-sm font-medium text-slate-600">Apellido</label>
                <p className="text-lg font-semibold text-slate-900">{citizen.apellido}</p>
              </div>
            )}

            {citizen.fechaNacimiento && (
              <div>
                <label className="text-sm font-medium text-slate-600">Fecha de Nacimiento</label>
                <p className="text-lg font-semibold text-slate-900">{citizen.fechaNacimiento}</p>
              </div>
            )}

            {citizen.direccion && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Dirección</label>
                <p className="text-lg font-semibold text-slate-900">{citizen.direccion}</p>
              </div>
            )}

            {citizen.estado && (
              <div>
                <label className="text-sm font-medium text-slate-600">Estado</label>
                <p className="text-lg font-semibold text-slate-900">{citizen.estado}</p>
              </div>
            )}

            {/* Mostrar otros campos dinámicos */}
            {Object.entries(citizen)
              .filter(([key]) => !['cedula', 'nombre', 'apellido', 'fechaNacimiento', 'direccion', 'estado'].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-lg font-semibold text-slate-900">{String(value)}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}

