import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  title: string;
  onMenuToggle: () => void;
}

export function Navbar({ title, onMenuToggle }: NavbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
