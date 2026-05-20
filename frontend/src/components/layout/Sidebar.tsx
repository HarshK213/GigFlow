import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuthStore } from "../../store/authStore";

const navLinks = [
	{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/leads", label: "Leads", icon: Users },
];

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-20 lg:hidden"
					onClick={onClose}
				/>
			)}
			<aside
				className={cn(
					"fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-[#c7c4d8] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="px-4 pt-4 pb-2">
					<div className="flex items-center gap-2 mb-1">
						<div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center">
							<span className="text-white font-black text-sm">
								G
							</span>
						</div>
						<span className="text-[16px] font-black text-[#0b1c30]">
							GigFlow
						</span>
					</div>
					<p className="text-[12px] font-medium text-[#464555] tracking-[0.05em] px-1">
						Enterprise Lead Management
					</p>
				</div>

				<nav className="flex-1 px-3 py-4 space-y-1">
					{navLinks.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							onClick={onClose}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200",
									isActive
										? "bg-[#e2dfff] text-[#3525cd] font-bold"
										: "text-[#464555] hover:bg-[#e5eeff]",
								)
							}
						>
							<link.icon className="h-5 w-5" />
							{link.label}
						</NavLink>
					))}
				</nav>

				<div className="px-4 pb-4 space-y-3">
					{user && (
						<div className="flex items-center gap-3 px-3 py-2">
							<div className="w-9 h-9 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold text-sm">
								{user.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-[14px] font-semibold text-[#0b1c30] truncate">
									{user.name}
								</p>
								<span className="inline-flex items-center rounded-full bg-[#e2dfff] px-2 py-0.5 text-[11px] font-bold text-[#3525cd]">
									{user.role}
								</span>
							</div>
						</div>
					)}
					<button
						onClick={handleLogout}
						className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#464555] hover:bg-[#e5eeff] text-[14px] font-medium transition-all duration-200"
					>
						<LogOut className="h-5 w-5" />
						Sign out
					</button>
				</div>
			</aside>
		</>
	);
}
