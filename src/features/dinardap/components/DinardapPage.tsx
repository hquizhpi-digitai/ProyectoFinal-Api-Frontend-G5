import { useDinardapSearch } from '../hooks/useDinardapSearch';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import ErrorMessage from '../../../shared/components/feedback/ErrorMessage';
import Loading from '../../../shared/components/feedback/Loading';

export default function DinardapPage() {
  const { results, isLoading, error, search } = useDinardapSearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Consulta DINARDAP</h1>
        <p className="text-slate-600">Búsqueda de información de ciudadanos</p>
      </div>

      <SearchForm onSearch={search} isLoading={isLoading} />

      {error && <ErrorMessage message={error} />}

      {isLoading && <Loading />}

      {!isLoading && !error && <SearchResults results={results} />}
    </div>
  );
}
