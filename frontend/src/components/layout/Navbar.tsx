import { Search, Plus, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  onMenuToggle: () => void;
  onAddLead: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Navbar({
  onMenuToggle,
  onAddLead,
  searchValue,
  onSearchChange,
}: NavbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center gap-4 w-full px-6 py-2 bg-white border-b border-[#c7c4d8]">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-[#464555] hover:bg-[#e5eeff]"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777587]" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads..."
          className="w-full bg-[#eff4ff] border border-[#c7c4d8] rounded-full py-2 pl-10 pr-4 text-[14px] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={onAddLead}
          className="flex items-center gap-2 px-4 py-2 bg-[#3525cd] text-white rounded-full font-bold text-[14px] hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Lead
        </button>

        <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
      </div>
    </header>
  );
}
