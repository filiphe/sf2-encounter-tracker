import { Condition, StatType, CONDITIONS } from "../data/conditions";

/** A condition applied to a creature, optionally with a value */
export interface AppliedCondition {
  conditionId: string;
  name: string;
  value?: number; // For value-based conditions (e.g., Frightened 2)
  color: string;
}

export interface StatModifier {
  source: string; // Condition name (with value if applicable)
  type: "status" | "circumstance" | "untyped";
  value: number;
  description: string;
}

export interface ModifiedStat {
  baseValue: number;
  finalValue: number;
  modifiers: StatModifier[];
}

/**
 * Check if a condition effect applies to a given stat type.
 */
function effectAppliesTo(effectTarget: StatType, statType: StatType): boolean {
  // Direct match
  if (effectTarget === statType) return true;

  // "all_checks" applies to all check-based stats
  if (effectTarget === "all_checks") {
    return ["perception", "initiative", "dexterity_checks", "strength_checks", "mental_checks", "attack"].includes(statType);
  }

  // "all_dcs" applies to all DCs. In PF2e/SF2e, AC is considered a DC (Defense DC),
  // so "all DCs" effects also apply to AC.
  if (effectTarget === "all_dcs") {
    return ["all_dcs", "ac"].includes(statType);
  }

  // "all_saves" applies to all saving throws
  if (effectTarget === "all_saves") {
    return ["fortitude", "reflex", "will"].includes(statType);
  }

  // "dexterity_checks" applies to dexterity-based checks
  if (effectTarget === "dexterity_checks" && statType === "dexterity_checks") return true;

  // "strength_checks" applies to strength-based checks
  if (effectTarget === "strength_checks" && statType === "strength_checks") return true;

  // "mental_checks" applies to INT/WIS/CHA-based checks
  if (effectTarget === "mental_checks" && statType === "mental_checks") return true;

  return false;
}

/**
 * Calculate the modified value of a stat based on applied conditions.
 */
export function getModifiedStat(
  baseValue: number,
  conditions: AppliedCondition[],
  statType: StatType
): ModifiedStat {
  const modifiers: StatModifier[] = [];

  for (const applied of conditions) {
    const condition = CONDITIONS.find(c => c.id === applied.conditionId);
    if (!condition) continue;

    const conditionValue = applied.value ?? 1;
    const displayName = condition.hasValue && applied.value
      ? `${condition.name} ${applied.value}`
      : condition.name;

    for (const effect of condition.effects) {
      if (effectAppliesTo(effect.target, statType)) {
        modifiers.push({
          source: displayName,
          type: effect.type,
          value: effect.valuePerUnit * conditionValue,
          description: effect.description.replace("X", String(conditionValue))
        });
      }
    }
  }

  const totalModifier = modifiers.reduce((sum, m) => sum + m.value, 0);

  return {
    baseValue,
    finalValue: baseValue + totalModifier,
    modifiers
  };
}

/**
 * Get all modifiers affecting a creature (for display purposes).
 */
export function getAllModifiers(conditions: AppliedCondition[]): StatModifier[] {
  const allModifiers: StatModifier[] = [];
  const seen = new Set<string>();

  for (const applied of conditions) {
    const condition = CONDITIONS.find(c => c.id === applied.conditionId);
    if (!condition) continue;

    const conditionValue = applied.value ?? 1;
    const displayName = condition.hasValue && applied.value
      ? `${condition.name} ${applied.value}`
      : condition.name;

    for (const effect of condition.effects) {
      const key = `${displayName}-${effect.target}-${effect.valuePerUnit}`;
      if (seen.has(key)) continue;
      seen.add(key);

      allModifiers.push({
        source: displayName,
        type: effect.type,
        value: effect.valuePerUnit * conditionValue,
        description: effect.description.replace("X", String(conditionValue))
      });
    }
  }

  return allModifiers;
}

/**
 * Parse a stat string like "+5" or "15" into a number.
 */
export function parseStatValue(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9-]/g, "");
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a stat value with its sign (e.g., +5, -2, 0).
 */
export function formatStatValue(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

/**
 * Get a summary of special (non-numeric) effects from conditions.
 */
export function getSpecialEffects(conditions: AppliedCondition[]): string[] {
  const effects: string[] = [];
  for (const applied of conditions) {
    const condition = CONDITIONS.find(c => c.id === applied.conditionId);
    if (!condition?.specialEffects) continue;

    for (const effect of condition.specialEffects) {
      const displayName = condition.hasValue && applied.value
        ? `${condition.name} ${applied.value}`
        : condition.name;
      effects.push(`${displayName}: ${effect}`);
    }
  }
  return effects;
}
