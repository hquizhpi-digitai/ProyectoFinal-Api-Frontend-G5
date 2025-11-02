import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuditoria } from '../features/dinardap/hooks/useAuditoria';
import Button from '../shared/components/ui/Button';
import Input from '../shared/components/ui/Input';
import Card from '../shared/components/ui/Card';
import ErrorMessage from '../shared/components/feedback/ErrorMessage';
import Loading from '../shared/components/feedback/Loading';
import { AuditoriaFilters } from '../features/dinardap/types/dinardap.types';

const filtersSchema = z.object({
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  cedula: z.string().optional(),
  usuario: z.string().optional(),
});

type FiltersFormData = z.infer<typeof filtersSchema>;

export default function AuditPage() {
  const {
    registros,
    paginacion,
    filters,
    isLoading,
    error,
    buscar,
    cambiarPagina,
    aplicarFiltros,
  } = useAuditoria();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
  });

  useEffect(() => {
    // Cargar registros iniciales
    buscar({ page: 1, limit: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FiltersFormData) => {
    const newFilters: AuditoriaFilters = {
      fechaInicio: data.fechaInicio || undefined,
      fechaFin: data.fechaFin || undefined,
      cedula: data.cedula || undefined,
      usuario: data.usuario || undefined,
      page: 1,
      limit: 50,
    };
    aplicarFiltros(newFilters);
  };

  const handleReset = () => {
    reset();
    aplicarFiltros({ page: 1, limit: 50 });
  };

  const getStatusBadge = (exitoso: boolean) => {
    return exitoso ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Exitoso
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Fallido
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Auditoría del Sistema</h1>
        <p className="text-slate-600">Visualización de registros de auditoría y actividad del sistema</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Filtros de Búsqueda</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Fecha Inicio"
              {...register('fechaInicio')}
            />
            <Input
              type="date"
              label="Fecha Fin"
              {...register('fechaFin')}
            />
            <Input
              label="Cédula"
              placeholder="Filtrar por cédula"
              {...register('cedula')}
            />
            <Input
              label="Usuario"
              placeholder="Filtrar por usuario"
              {...register('usuario')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 focus:ring-purple-600"
            >
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Limpiar Filtros
            </Button>
          </div>
        </form>
      </Card>

      {error && <ErrorMessage message={error} />}

      {isLoading && <Loading />}

      {!isLoading && registros.length > 0 && (
        <>
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Registros de Auditoría</h2>
              {paginacion && (
                <p className="text-sm text-slate-600">
                  Mostrando {registros.length} de {paginacion.totalRegistros} registros
                </p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fecha/Hora</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Cédula</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Endpoint</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Método</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">IP Origen</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro, index) => (
                    <tr key={registro._id || index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {new Date(registro.fechaHora).toLocaleString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">{registro.usuario}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{registro.cedula}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{registro.endpoint}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          {registro.metodo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{registro.ipOrigen}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(registro.exitoso)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginacion && paginacion.totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Página {paginacion.paginaActual} de {paginacion.totalPaginas}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                    disabled={paginacion.paginaActual === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                    disabled={paginacion.paginaActual === paginacion.totalPaginas || isLoading}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {!isLoading && registros.length === 0 && !error && (
        <Card className="p-12">
          <div className="text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No se encontraron registros de auditoría</p>
            <p className="text-sm mt-2">Intente ajustar los filtros de búsqueda</p>
          </div>
        </Card>
      )}
    </div>
  );
}
