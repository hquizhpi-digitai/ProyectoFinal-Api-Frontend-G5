import Card from '../shared/components/ui/Card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Configuración</h1>
        <p className="text-slate-600">Configuración del sistema</p>
      </div>

      <Card className="p-12">
        <div className="text-center text-slate-500">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Funcionalidad en desarrollo</p>
        </div>
      </Card>
    </div>
  );
}
