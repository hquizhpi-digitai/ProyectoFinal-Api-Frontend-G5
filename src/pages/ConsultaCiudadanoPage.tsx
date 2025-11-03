import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, CheckCircle } from 'lucide-react';
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

          {/* Debug en desarrollo */}
          {import.meta.env.DEV && (
            <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-xs font-mono text-slate-600">
                🔍 Debug: {Object.keys(citizen).length} campos encontrados
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mostrar TODOS los campos del objeto citizen dinámicamente */}
            {Object.entries(citizen).map(([key, value]) => {
              // Ignorar campos técnicos de MongoDB que no son útiles para el usuario
              if (key === '__v') return null;

              // Formatear el nombre del campo para mostrar
              const nombreCampo = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();

              // Mapear nombres de campos comunes a etiquetas más amigables
              const etiquetas: Record<string, string> = {
                '_id': 'ID',
                'cedula': 'Cédula',
                'nombre': 'Nombre Completo',
                'fechanacimiento': 'Fecha de Nacimiento',
                'fechaexpedicion': 'Fecha de Expedición',
                'lugarnacimiento': 'Lugar de Nacimiento',
                'estadocivil': 'Estado Civil',
                'instruccion': 'Instrucción',
                'createdAt': 'Fecha de Creación',
                'updatedAt': 'Última Actualización',
              };

              const etiqueta = etiquetas[key] || nombreCampo;

              // Formatear el valor
              let valorFormateado: string | ReactNode = String(value || '-');

              // Manejar fechas
              if (value && typeof value === 'string') {
                // Intentar parsear como fecha si tiene formato ISO
                const fechaMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
                if (fechaMatch) {
                  try {
                    const fecha = new Date(value);
                    if (!isNaN(fecha.getTime())) {
                      if (key.includes('fecha') && !key.includes('expedicion')) {
                        valorFormateado = fecha.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                      } else {
                        valorFormateado = fecha.toLocaleString('es-ES');
                      }
                    }
                  } catch (e) {
                    // Si falla, usar el valor original
                  }
                }
              }

              // Manejar estado especial
              if (key === 'estado') {
                valorFormateado = (
                  <span className={`${
                    value === 'ACTIVA' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {String(value)}
                  </span>
                );
              }

              // Manejar ID especial
              if (key === '_id') {
                valorFormateado = (
                  <span className="font-mono text-sm">{String(value)}</span>
                );
              }

              // Determinar si ocupa 2 columnas
              const ocupaDosColumnas = ['nombre', 'domicilio'].includes(key);

              return (
                <div key={key} className={ocupaDosColumnas ? 'md:col-span-2' : ''}>
                  <label className="text-sm font-medium text-slate-600 block mb-1">
                    {etiqueta}
                  </label>
                  <p className={`text-lg font-semibold text-slate-900 ${
                    value === null || value === undefined || value === '' ? 'text-slate-400 italic' : ''
                  }`}>
                    {valorFormateado}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
