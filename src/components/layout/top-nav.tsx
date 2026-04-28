"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Trophy, Target, UserIcon, LogOut } from "lucide-react";
import { logoutAction } from "@/modules/auth/actions";

export function TopNav() {
  const pathname = usePathname();

  // Esconder na landing page, login e recuperar senha
  const hiddenRoutes = ["/", "/login", "/recuperar-senha"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <div className="hidden md:flex items-center gap-3">
      {pathname !== "/dashboard" && (
        <Link href="/dashboard" className="system-btn-secondary !p-3 flex items-center justify-center hover:bg-slate-800" title="Status do Sistema">
          <LayoutDashboard size={20} />
        </Link>
      )}
      
      <Link href="/loja" className={`system-btn-secondary !p-3 flex items-center justify-center border-purple-500/30 text-purple-400 hover:border-purple-400 hover:text-purple-300 hover:bg-purple-500/10 ${pathname === '/loja' ? 'bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : ''}`} title="Loja do Sistema">
        <ShoppingCart size={20} />
      </Link>
      
      <Link href="/conquistas" className={`system-btn-secondary !p-3 flex items-center justify-center border-amber-500/30 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/10 ${pathname === '/conquistas' ? 'bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : ''}`} title="Títulos e Conquistas">
        <Trophy size={20} />
      </Link>
      
      <Link href="/habitos" className={`system-btn-secondary !p-3 flex items-center justify-center border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 ${pathname === '/habitos' ? 'bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}`} title="Gerenciar Quests">
        <Target size={20} />
      </Link>
      
      <Link href="/perfil" className={`system-btn-secondary !p-3 flex items-center justify-center border-sky-500/30 text-sky-400 hover:border-sky-400 hover:text-sky-300 hover:bg-sky-500/10 ${pathname === '/perfil' ? 'bg-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.3)]' : ''}`} title="Perfil do Caçador">
        <UserIcon size={20} />
      </Link>
      
      <form action={logoutAction}>
        <button type="submit" className="system-btn-secondary !p-3 flex items-center justify-center border-red-900/50 text-red-400 hover:border-red-500 hover:text-red-300 hover:bg-red-900/20" title="Desconectar">
          <LogOut size={20} />
        </button>
      </form>
    </div>
  );
}
