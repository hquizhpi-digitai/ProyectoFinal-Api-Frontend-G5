import { NavLink } from 'react-router-dom';
import { Search, Users, FileText, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Consulta DINARDAP', href: '/dashboard', icon: Search },
  { name: 'Consulta Ciudadano', href: '/citizens', icon: Users },
  { name: 'Validación Identidad', href: '/validacion', icon: Shield },
  { name: 'Auditoría', href: '/audit', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Ministerio de</h1>
            <h1 className="text-lg font-bold leading-tight">Gobierno</h1>
          </div>
        </div>
        {user && (
          <p className="text-sm text-blue-200 mt-2 truncate">{user.email}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-blue-100 hover:bg-blue-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
