import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Card from '../../../shared/components/ui/Card';
import { DinardapSearchParams } from '../types/dinardap.types';

const searchSchema = z.object({
  cedula: z.string().optional(),
  nombres: z.string().optional(),
  apellidos: z.string().optional(),
}).refine(
  (data) => data.cedula || data.nombres || data.apellidos,
  {
    message: 'Debe ingresar al menos un criterio de búsqueda',
  }
);

interface SearchFormProps {
  onSearch: (params: DinardapSearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DinardapSearchParams>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: DinardapSearchParams) => {
    onSearch(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Search className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Búsqueda de Ciudadanos</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Cédula"
            placeholder="Ingrese número de cédula"
            {...register('cedula')}
          />

          <Input
            label="Nombres"
            placeholder="Ingrese nombres"
            {...register('nombres')}
          />

          <Input
            label="Apellidos"
            placeholder="Ingrese apellidos"
            {...register('apellidos')}
          />
        </div>

        {errors.root && (
          <p className="text-sm text-red-600">{errors.root.message}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
          >
            Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Limpiar
          </Button>
        </div>
      </form>
    </Card>
  );
}
