"use client";

import { useState } from "react";
import { CreateRewardForm } from "./create-reward-form";
import { RewardItem } from "./reward-item";
import { Reward } from "@/modules/rewards/domain/reward";
import { Plus, X, ShoppingCart } from "lucide-react";

export function StoreManager({ initialRewards, availablePoints }: { initialRewards: Reward[], availablePoints: number }) {
  const [isCreating, setIsCreating] = useState(false);
  const enableTestItems = process.env.NEXT_PUBLIC_ENABLE_TEST_ITEMS === "true";

  const getMeta = (reward: Reward): { categoryLabel?: string; description?: string; noteLabel?: string } => {
    const title = reward.title.toLowerCase();

    if (reward.id === "frame_test") {
      return {
        categoryLabel: "Cosmético",
        description: "Moldura rara aplicada automaticamente no seu perfil (item de teste).",
        noteLabel: "Teste grátis",
      };
    }

    if (title.includes("moldura do perfil")) {
      const isEpic = reward.pointsCost >= 300 || title.includes("épica") || title.includes("epica");
      return {
        categoryLabel: "Cosmético",
        description: isEpic
          ? "Moldura épica com brilho mais intenso aplicada automaticamente no seu perfil."
          : "Moldura rara aplicada automaticamente no seu perfil.",
        noteLabel: isEpic ? "Efeito no perfil (Épica)" : "Efeito no perfil",
      };
    }

    const descriptions: Record<string, string> = {
      "pausa estratégica (15 min)": "Recarregue energia e volte ao sistema com foco total.",
      "café especial": "Um ritual curto para resetar a mente e manter o ritmo.",
      "30 min de jogo": "Recompensa controlada: diversão sem culpa, com limite.",
      "1 episódio de série": "Descanse sem quebrar o sistema. Um episódio e volta.",
      "sobremesa (sem culpa)": "Uma indulgência planejada como recompensa por disciplina.",
      "cinema / encontro": "Recompensa social. Construa vida fora do grind.",
      "day off (meio período)": "Pausa estratégica para evitar burnout e manter consistência.",
      "compra pequena (até r$30)": "Recompensa material pequena para reforçar progresso.",
      "livro / curso (investimento)": "Invista em longo prazo. O sistema aprova evolução real.",
      "recompensa épica (algo grande)": "Um prêmio grande para marcos importantes.",
      "poção de cura (restaura 30 hp)": "Restaura 30 HP imediatamente.",
      "kit de primeiros socorros (50 hp)": "Recuperação maior para não quebrar a ofensiva.",
      "reanimação (1 uso)": "Uma segunda chance para voltar ao jogo após uma queda.",
      "selo do caçador (cancelar 1 inimigo)": "Neutralize um erro do dia sem tomar dano (uso controlado).",
      "escudo temporal (24h)": "Proteja sua consistência por 24h (ideal para dias caóticos).",
      "pergaminho de disciplina (24h)": "Reforço de disciplina por 24h: use para um dia decisivo.",
      "amuleto do foco (24h)": "Aumente seu foco por 24h: um dia inteiro no modo execução.",
      "cosmético: moldura do perfil (rara)": "Personalização do perfil. Mostre seu status no sistema.",
      "cosmético: título dourado (raro)": "Assinatura visual para quem passou por provações.",
      "cosmético: tema de classe (raro)": "Um visual especial para celebrar sua evolução.",
    };

    const descKey = Object.keys(descriptions).find((k) => title === k) ?? null;
    const description = descKey ? descriptions[descKey] : undefined;

    if (reward.id === "potion") {
      return { categoryLabel: "Consumível", description, noteLabel: "Efeito no sistema" };
    }

    if (title.includes("poção") || title.includes("kit") || title.includes("reanima") || title.includes("selo")) {
      return { categoryLabel: "Consumível", description, noteLabel: "Recompensa manual" };
    }

    if (title.includes("escudo") || title.includes("pergaminho") || title.includes("amuleto") || title.includes("bônus") || title.includes("buff")) {
      return { categoryLabel: "Boost", description, noteLabel: "Recompensa manual" };
    }

    if (title.includes("moldura") || title.includes("título") || title.includes("cosmético")) {
      return { categoryLabel: "Cosmético", description, noteLabel: "Visual/Manual" };
    }

    return { categoryLabel: "Recompensa", description, noteLabel: "Recompensa manual" };
  };

  const potionReward: Reward = {
    id: "potion",
    title: "Poção de Cura (Restaura 30 HP)",
    pointsCost: 50,
    available: true,
  };

  const testFrameReward: Reward = {
    id: "frame_test",
    title: "Moldura do Perfil (Teste Grátis)",
    pointsCost: 0,
    available: true,
  };

  const allRewards = (enableTestItems ? [testFrameReward] : []).concat([potionReward, ...initialRewards]);
  const grouped = allRewards.reduce<Record<string, Reward[]>>((acc, r) => {
    const meta = getMeta(r);
    const key = r.id === "potion" ? "Consumível" : meta.categoryLabel ?? "Recompensa";
    acc[key] = acc[key] ? [...acc[key], r] : [r];
    return acc;
  }, {});

  const orderedCategories = ["Consumível", "Boost", "Recompensa", "Cosmético"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <ShoppingCart size={24} className="text-amber-500" />
          Itens Disponíveis
        </h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="system-btn-primary !bg-amber-600 hover:!bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] py-2 px-4 text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)] flex items-center gap-2 w-full sm:w-auto text-amber-950 font-bold"
          >
            <Plus size={16} /> Adicionar Nova Recompensa
          </button>
        )}
      </div>

      {isCreating && (
        <div className="system-card p-6 border-amber-500/50 bg-amber-950/10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-amber-400 tracking-widest uppercase">Criar Item na Loja</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-heading uppercase tracking-widest"
            >
              <X size={16} /> Cancelar
            </button>
          </div>
          <CreateRewardForm onSuccess={() => setIsCreating(false)} />
        </div>
      )}

      <section className="system-card p-6 border-amber-900/30">
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-xs font-heading font-bold tracking-widest uppercase text-slate-300">
            Itens do Sistema vs Recompensas
          </p>
          <p className="text-sm text-slate-400 font-body mt-2">
            Apenas itens marcados como <span className="text-rose-300">Efeito no sistema</span> aplicam mudanças automáticas.
            Os demais são <span className="text-slate-200">recompensas manuais</span> (use como prêmio do mundo real).
          </p>
        </div>

        {orderedCategories
          .filter((c) => (grouped[c] ?? []).length > 0)
          .map((category) => (
            <div key={category} className="mb-8 last:mb-0">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-heading font-bold tracking-widest uppercase text-slate-300">
                  {category === "Consumível"
                    ? "Consumíveis"
                    : category === "Boost"
                      ? "Boosts"
                      : category === "Cosmético"
                        ? "Cosméticos"
                        : "Recompensas"}
                </h3>
                <span className={`text-[10px] font-heading font-bold tracking-widest uppercase px-2 py-1 rounded border ${
                  category === "Consumível"
                    ? "text-emerald-300 bg-emerald-950/30 border-emerald-500/30"
                    : category === "Boost"
                      ? "text-indigo-300 bg-indigo-950/30 border-indigo-500/30"
                      : category === "Cosmético"
                        ? "text-fuchsia-300 bg-fuchsia-950/30 border-fuchsia-500/30"
                        : "text-amber-300 bg-amber-950/30 border-amber-500/30"
                }`}>
                  {grouped[category]?.length ?? 0}
                </span>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(grouped[category] ?? []).map((reward) => (
                  <RewardItem
                    key={reward.id}
                    reward={reward}
                    availablePoints={availablePoints}
                    isSystemItem={reward.id === "potion"}
                    meta={getMeta(reward)}
                  />
                ))}
              </ul>
            </div>
          ))}

        {initialRewards.length === 0 && (
          <div className="text-center py-10 mt-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="mx-auto h-16 w-16 rounded-full bg-purple-900/20 flex items-center justify-center mb-4 border border-purple-900/30">
              <ShoppingCart size={28} className="text-purple-500/50" />
            </div>
            <p className="text-lg text-slate-300 font-heading font-bold tracking-widest uppercase mb-2">Sem Itens Personalizados</p>
            <p className="text-sm text-slate-500 font-body mb-6">Use os itens pré-prontos do Sistema ou crie suas próprias recompensas.</p>
          </div>
        )}
      </section>
    </div>
  );
}
