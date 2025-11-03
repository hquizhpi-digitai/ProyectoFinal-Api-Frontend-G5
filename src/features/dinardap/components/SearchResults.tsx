import { DinardapResult } from '../types/dinardap.types';
import Card from '../../../shared/components/ui/Card';
import { User, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface SearchResultsProps {
  results: DinardapResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-slate-500">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No se encontraron resultados</p>
          <p className="text-sm mt-2">Intente ajustar los criterios de búsqueda</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Resultados ({results.length})
        </h3>
      </div>

      {results.map((result, index) => {
        // Obtener un ID único para el resultado
        const resultId = (result as any)._id || result.id || result.cedula || `result-${index}`;
        
        return (
          <Card key={resultId} className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h4 className="text-xl font-bold text-slate-900">
                {result.nombre || result.nombres || 'Ciudadano'} {result.apellidos || ''}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mostrar TODOS los campos del resultado dinámicamente */}
              {Object.entries(result).map(([key, value]) => {
                // Ignorar campos técnicos que no son útiles para el usuario
                if (key === '__v') return null;
                
                // Formatear el nombre del campo
                const nombreCampo = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();
                
                // Mapear nombres de campos a etiquetas amigables
                const etiquetas: Record<string, string> = {
                  '_id': 'ID',
                  'id': 'ID',
                  'cedula': 'Cédula',
                  'nombre': 'Nombre Completo',
                  'nombres': 'Nombres',
                  'apellidos': 'Apellidos',
                  'fechanacimiento': 'Fecha de Nacimiento',
                  'fechaNacimiento': 'Fecha de Nacimiento',
                  'fechaexpedicion': 'Fecha de Expedición',
                  'lugarnacimiento': 'Lugar de Nacimiento',
                  'estadocivil': 'Estado Civil',
                  'estadoCivil': 'Estado Civil',
                  'instruccion': 'Instrucción',
                  'domicilio': 'Domicilio',
                  'direccion': 'Dirección',
                  'createdAt': 'Fecha de Creación',
                  'updatedAt': 'Última Actualización',
                };
                
                const etiqueta = etiquetas[key] || nombreCampo;
                
                // Formatear el valor
                let valorFormateado: string | ReactNode = String(value || '-');
                
                // Manejar fechas
                if (value && typeof value === 'string') {
                  const fechaMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
                  if (fechaMatch) {
                    try {
                      const fecha = new Date(value);
                      if (!isNaN(fecha.getTime())) {
                        if (key.includes('nacimiento') || (key.includes('fecha') && !key.includes('expedicion'))) {
                          // Fechas de nacimiento: formato largo
                          valorFormateado = fecha.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } else {
                          // Otras fechas: formato completo con hora
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
                if (key === '_id' || key === 'id') {
                  valorFormateado = (
                    <span className="font-mono text-sm">{String(value)}</span>
                  );
                }
                
                // Determinar si ocupa 2 columnas
                const ocupaDosColumnas = ['nombre', 'domicilio', 'direccion', 'nombres'].includes(key);
                
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
        );
      })}
    </div>
  );
}
