import { DinardapResult } from '../types/dinardap.types';
import Card from '../../../shared/components/ui/Card';
import { User } from 'lucide-react';

interface SearchResultsProps {
  results: DinardapResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-slate-500">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No se encontraron resultados</p>
          <p className="text-sm mt-2">Intente ajustar los criterios de búsqueda</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Resultados ({results.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.id} hover className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">
                  {result.nombres} {result.apellidos}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Cédula: {result.cedula}
                </p>
                {result.fechaNacimiento && (
                  <p className="text-sm text-slate-500 mt-1">
                    Fecha de nacimiento: {new Date(result.fechaNacimiento).toLocaleDateString('es-EC')}
                  </p>
                )}
                {result.estadoCivil && (
                  <p className="text-sm text-slate-500">
                    Estado civil: {result.estadoCivil}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Search(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
