import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { useValidacionIdentidad } from '../features/dinardap/hooks/useValidacionIdentidad';
import Button from '../shared/components/ui/Button';
import Input from '../shared/components/ui/Input';
import Card from '../shared/components/ui/Card';
import ErrorMessage from '../shared/components/feedback/ErrorMessage';
import Loading from '../shared/components/feedback/Loading';

const validacionSchema = z.object({
  cedula: z.string().min(1, 'La cédula es requerida'),
});

type ValidacionFormData = z.infer<typeof validacionSchema>;

export default function ValidacionIdentidadPage() {
  const { validacion, isLoading, error, validar, reset } = useValidacionIdentidad();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidacionFormData>({
    resolver: zodResolver(validacionSchema),
  });

  const onSubmit = async (data: ValidacionFormData) => {
    await validar(data.cedula);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Validación de Identidad</h1>
        <p className="text-slate-600">Valide la identidad de un ciudadano verificando su número de cédula</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Validar Identidad</h2>
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
              className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-green-600"
            >
              Validar
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

      {!isLoading && validacion && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {validacion.valida ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <h2 className="text-xl font-bold text-slate-900">Resultado de la Validación</h2>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              validacion.valida 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {validacion.valida ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-bold text-green-800">Identidad Válida</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-lg font-bold text-red-800">Identidad No Válida</span>
                  </>
                )}
              </div>
              {validacion.motivo && (
                <p className={`text-sm ${validacion.valida ? 'text-green-700' : 'text-red-700'}`}>
                  {validacion.motivo}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="text-sm font-medium text-slate-600">Cédula</label>
                <p className="text-lg font-semibold text-slate-900">{validacion.cedula}</p>
              </div>

              {validacion.nombre && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Nombre</label>
                  <p className="text-lg font-semibold text-slate-900">{validacion.nombre}</p>
                </div>
              )}

              {validacion.estado && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Estado</label>
                  <p className="text-lg font-semibold text-slate-900">{validacion.estado}</p>
                </div>
              )}

              {validacion.fechaValidacion && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Fecha de Validación</label>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(validacion.fechaValidacion).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

