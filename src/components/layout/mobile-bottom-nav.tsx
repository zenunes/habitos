"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Trophy, Target, UserIcon } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Esconder na landing page, login e recuperar senha
  const hiddenRoutes = ["/", "/login", "/recuperar-senha"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/90 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <ul className="flex items-center justify-around px-2 py-3">
        <li>
          <Link href="/dashboard" className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === '/dashboard' ? 'text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}>
            <LayoutDashboard size={20} className="mb-1" />
            <span className="text-[9px] font-heading tracking-wider uppercase font-bold">Status</span>
          </Link>
        </li>
        <li>
          <Link href="/habitos" className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === '/habitos' ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}>
            <Target size={20} className="mb-1" />
            <span className="text-[9px] font-heading tracking-wider uppercase font-bold">Quests</span>
          </Link>
        </li>
        <li>
          <Link href="/loja" className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === '/loja' ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}>
            <ShoppingCart size={20} className="mb-1" />
            <span className="text-[9px] font-heading tracking-wider uppercase font-bold">Loja</span>
          </Link>
        </li>
        <li>
          <Link href="/conquistas" className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === '/conquistas' ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}>
            <Trophy size={20} className="mb-1" />
            <span className="text-[9px] font-heading tracking-wider uppercase font-bold">Títulos</span>
          </Link>
        </li>
        <li>
          <Link href="/perfil" className={`flex flex-col items-center p-2 rounded-lg transition-all ${pathname === '/perfil' ? 'text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : 'text-slate-500 hover:text-slate-300'}`}>
            <UserIcon size={20} className="mb-1" />
            <span className="text-[9px] font-heading tracking-wider uppercase font-bold">Perfil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
