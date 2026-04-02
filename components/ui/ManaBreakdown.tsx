import { View, Text } from "react-native";
import { PixelCard } from "./PixelCard";
import type { ManaBreakdown as ManaBreakdownType } from "@/lib/manaEngine";

interface Props {
  breakdown: ManaBreakdownType;
  durationMinutes: number;
}

export function ManaBreakdownCard({ breakdown, durationMinutes }: Props) {
  return (
    <PixelCard className="mt-3">
      <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
        Mana-beregning
      </Text>

      {/* Main result */}
      <View className="items-center mb-4">
        <Text className="font-pixel text-3xl text-accent-400">
          +{breakdown.totalMana}
        </Text>
        <Text className="text-xs text-white/30 mt-1">
          mana for {durationMinutes} minutter
        </Text>
      </View>

      {/* Breakdown lines */}
      <View className="gap-1.5">
        <BreakdownLine
          label="Grunnmana"
          value={breakdown.baseMana}
          icon={"\u26A1"}
        />

        {breakdown.diminishingMana !== breakdown.baseMana && (
          <BreakdownLine
            label="Etter gjentakelse"
            value={breakdown.diminishingMana}
            icon={"\uD83D\uDD04"}
            isReduction={breakdown.diminishingMana < breakdown.baseMana}
          />
        )}

        {breakdown.varietyBonus > 0 && (
          <BreakdownLine
            label="Variasjonsbonus"
            value={breakdown.varietyBonus}
            icon={"\uD83C\uDF08"}
            isBonus
          />
        )}

        {breakdown.streakBonus > 0 && (
          <BreakdownLine
            label="Streak-bonus"
            value={breakdown.streakBonus}
            icon={"\uD83D\uDD25"}
            isBonus
          />
        )}

        {breakdown.equipmentBonus > 0 && (
          <BreakdownLine
            label="Utstyrsbonus"
            value={breakdown.equipmentBonus}
            icon={"\uD83D\uDEE1\uFE0F"}
            isBonus
          />
        )}
      </View>

      {/* Efficiency indicator */}
      <View className="mt-3 pt-3 border-t border-white/5">
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] text-white/25">Effektivitet</Text>
          <EfficiencyBadge efficiency={breakdown.sessionEfficiency} />
        </View>
      </View>

      {/* Explanation */}
      {breakdown.explanation.length > 0 && (
        <View className="mt-3 gap-0.5">
          {breakdown.explanation.map((line, i) => (
            <Text key={i} className="text-[10px] text-white/20">
              {line}
            </Text>
          ))}
        </View>
      )}

      {/* Warnings */}
      {breakdown.warnings.length > 0 && (
        <View className="mt-2 bg-accent-500/10 border border-accent-500/20 rounded-lg px-3 py-2">
          {breakdown.warnings.map((warning, i) => (
            <Text key={i} className="text-[10px] text-accent-400">
              {"\uD83D\uDCA1"} {warning}
            </Text>
          ))}
        </View>
      )}
    </PixelCard>
  );
}

function BreakdownLine({
  label,
  value,
  icon,
  isBonus = false,
  isReduction = false,
}: {
  label: string;
  value: number;
  icon: string;
  isBonus?: boolean;
  isReduction?: boolean;
}) {
  const valueColor = isBonus
    ? "text-primary-400"
    : isReduction
    ? "text-danger-400"
    : "text-white/60";

  const prefix = isBonus ? "+" : "";

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Text className="text-xs">{icon}</Text>
        <Text className="text-xs text-white/40">{label}</Text>
      </View>
      <Text className={`font-pixel text-xs ${valueColor}`}>
        {prefix}{value}
      </Text>
    </View>
  );
}

function EfficiencyBadge({ efficiency }: { efficiency: number }) {
  let color: string;
  let label: string;

  if (efficiency >= 1.5) {
    color = "text-primary-400";
    label = "Perfekt!";
  } else if (efficiency >= 1.0) {
    color = "text-accent-400";
    label = "Bra";
  } else if (efficiency >= 0.5) {
    color = "text-info-400";
    label = "OK";
  } else {
    color = "text-white/30";
    label = "Lav";
  }

  return (
    <Text className={`font-pixel text-[8px] ${color}`}>
      {efficiency.toFixed(1)} mana/min ({label})
    </Text>
  );
}
