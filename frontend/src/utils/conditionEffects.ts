import { Condition, StatType, CONDITIONS } from "../data/conditions";

/** A condition applied to a creature, optionally with a value */
export interface AppliedCondition {
  conditionId: string;
  name: string;
  /** For value-based conditions (e.g., Frightened 2). Persistent Damage uses a dice string like "1d6 Fire". */
  value?: number | string;
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
 * Get the numeric value of an applied condition for effect calculations.
 * Free-form values (e.g., persistent damage "1d6 Fire") use their leading number, defaulting to 1.
 */
function getNumericValue(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (value === undefined) return 1;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 1 : parsed;
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

    const conditionValue = getNumericValue(applied.value);
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

/** Saving throw stat types. A save DC is 10 + the save bonus. */
export type SaveStatType = "fortitude" | "reflex" | "will";

/**
 * DC effect targets that apply to each save DC on top of the save bonus.
 * Some conditions penalize DCs directly instead of the save itself:
 * "all_dcs" (Frightened, Sickened) hits every save DC, "dexterity_dcs"
 * (Clumsy) hits the Reflex DC, and "mental_dcs" (Stupefied) hits the Will DC.
 * Note this intentionally excludes "strength_dcs" (Enfeebled), which is not a save DC.
 */
const SAVE_DC_EFFECT_TARGETS: Record<SaveStatType, StatType[]> = {
  fortitude: ["all_dcs"],
  reflex: ["all_dcs", "dexterity_dcs"],
  will: ["all_dcs", "mental_dcs"],
};

/**
 * Calculate a save DC (10 + save bonus) based on applied conditions.
 *
 * The save bonus modifiers also affect the DC (since DC = 10 + save bonus),
 * and DC-specific condition penalties (e.g., Frightened/Sickened "all DCs",
 * Clumsy "Dexterity-based DCs", Stupefied "INT/WIS/CHA-based DCs") stack on top.
 */
export function getModifiedSaveDc(
  baseSave: number,
  conditions: AppliedCondition[],
  saveType: SaveStatType
): ModifiedStat {
  // Save bonus modifiers feed into the DC (DC = 10 + save bonus)
  const save = getModifiedStat(baseSave, conditions, saveType);

  // DC-only modifiers that stack on top of the save bonus
  const dcTargets = SAVE_DC_EFFECT_TARGETS[saveType];
  const dcModifiers: StatModifier[] = [];
  for (const applied of conditions) {
    const condition = CONDITIONS.find(c => c.id === applied.conditionId);
    if (!condition) continue;

    const conditionValue = getNumericValue(applied.value);
    const displayName = condition.hasValue && applied.value
      ? `${condition.name} ${applied.value}`
      : condition.name;

    for (const effect of condition.effects) {
      if (dcTargets.some(target => effectAppliesTo(effect.target, target))) {
        dcModifiers.push({
          source: displayName,
          type: effect.type,
          value: effect.valuePerUnit * conditionValue,
          description: effect.description.replace("X", String(conditionValue))
        });
      }
    }
  }

  const totalDcModifier = dcModifiers.reduce((sum, m) => sum + m.value, 0);

  return {
    baseValue: 10 + baseSave,
    finalValue: 10 + save.finalValue + totalDcModifier,
    modifiers: [...save.modifiers, ...dcModifiers]
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

    const conditionValue = getNumericValue(applied.value);
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
      effects.push(`${displayName}: ${effect.replaceAll("X", String(applied.value ?? 1))}`);
    }
  }
  return effects;
}
