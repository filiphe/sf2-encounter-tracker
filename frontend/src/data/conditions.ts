// Condition data with mechanical effects for SF2e/PF2e
// Effects are encoded based on the condition descriptions from Archives of Nethys

export type StatType =
  | "perception"
  | "ac"
  | "fortitude"
  | "reflex"
  | "will"
  | "attack"
  | "initiative"
  | "all_checks"
  | "all_dcs"
  | "dexterity_checks"
  | "strength_checks"
  | "mental_checks"
  | "dexterity_dcs"
  | "strength_dcs"
  | "mental_dcs"
  | "speed"
  | "all_saves";

export interface ConditionEffect {
  type: "status" | "circumstance" | "untyped";
  target: StatType;
  /** Value per condition value (for value-based conditions, this is multiplied by the condition value) */
  valuePerUnit: number;
  description: string;
}

export interface Condition {
  id: string;
  name: string;
  url: string;
  summary: string;
  /** Does this condition include a value (e.g., Frightened 1, Frightened 2)? */
  hasValue: boolean;
  /** Label for the value input (e.g., "Value", "Actions lost") */
  valueLabel?: string;
  /** Input type for the value: "number" (default) or free-form "text" (e.g., persistent damage "1d6 Fire") */
  valueInputType?: "number" | "text";
  /** Mechanical effects. For value-based conditions, valuePerUnit is multiplied by the condition value. */
  effects: ConditionEffect[];
  /** Special effects that can't be modeled as numeric modifiers */
  specialEffects?: string[];
  /** Color for the badge (Tailwind class) */
  color: string;
}

export const CONDITIONS: Condition[] = [
  {
    id: "blinded",
    name: "Blinded",
    url: "/conditions/1-blinded",
    summary: "You can't see. You automatically critically fail Perception checks that require vision, and if vision is your only precise sense, you take a –4 status penalty to Perception checks.",
    hasValue: false,
    color: "bg-gray-600",
    effects: [
      { type: "status", target: "perception", valuePerUnit: -4, description: "–4 status penalty to Perception checks" }
    ],
    specialEffects: ["Auto critical fail on visual Perception checks", "Immune to visual effects", "Blinded overrides Dazzled"]
  },
  {
    id: "dazzled",
    name: "Dazzled",
    url: "/conditions/7-dazzled",
    summary: "Your eyes are overstimulated. If vision is your only precise sense, all creatures and objects are concealed from you.",
    hasValue: false,
    color: "bg-yellow-500",
    effects: [],
    specialEffects: ["Creatures and objects are concealed (flat check to target)"]
  },
  {
    id: "deafened",
    name: "Deafened",
    url: "/conditions/8-deafened",
    summary: "You can't hear. You automatically critically fail Perception checks that require hearing. You take a –2 status penalty to Perception checks.",
    hasValue: false,
    color: "bg-gray-500",
    effects: [
      { type: "status", target: "perception", valuePerUnit: -2, description: "–2 status penalty to Perception checks" }
    ],
    specialEffects: ["Auto critical fail on auditory Perception checks"]
  },
  {
    id: "frightened",
    name: "Frightened",
    url: "/conditions/18-frightened",
    summary: "You're gripped by fear. You take a status penalty equal to this value to all your checks and DCs. Decreases by 1 at the end of each of your turns.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-purple-600",
    effects: [
      { type: "status", target: "all_checks", valuePerUnit: -1, description: "–X status penalty to all checks" },
      { type: "status", target: "all_dcs", valuePerUnit: -1, description: "–X status penalty to all DCs (incl. AC)" }
    ],
    specialEffects: ["Value decreases by 1 at the end of each turn"]
  },
  {
    id: "sickened",
    name: "Sickened",
    url: "/conditions/35-sickened",
    summary: "You feel ill. You take a status penalty equal to this value on all your checks and DCs. You can't willingly ingest anything.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-green-600",
    effects: [
      { type: "status", target: "all_checks", valuePerUnit: -1, description: "–X status penalty to all checks" },
      { type: "status", target: "all_dcs", valuePerUnit: -1, description: "–X status penalty to all DCs (incl. AC)" }
    ],
    specialEffects: ["Can't willingly ingest anything"]
  },
  {
    id: "clumsy",
    name: "Clumsy",
    url: "/conditions/3-clumsy",
    summary: "Your movements become clumsy. You take a status penalty equal to the condition value to Dexterity-based checks, Reflex saves, and Dexterity-based DCs.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-orange-500",
    effects: [
      { type: "status", target: "dexterity_checks", valuePerUnit: -1, description: "–X status penalty to Dexterity-based checks" },
      { type: "status", target: "reflex", valuePerUnit: -1, description: "–X status penalty to Reflex saves" },
      { type: "status", target: "dexterity_dcs", valuePerUnit: -1, description: "–X status penalty to Dexterity-based DCs" }
    ]
  },
  {
    id: "enfeebled",
    name: "Enfeebled",
    url: "/conditions/13-enfeebled",
    summary: "You're physically weakened. You take a status penalty equal to the condition value to Strength-based checks, melee attack rolls, and Strength-based DCs.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-red-400",
    effects: [
      { type: "status", target: "strength_checks", valuePerUnit: -1, description: "–X status penalty to Strength-based checks" },
      { type: "status", target: "attack", valuePerUnit: -1, description: "–X status penalty to melee attack rolls" },
      { type: "status", target: "strength_dcs", valuePerUnit: -1, description: "–X status penalty to Strength-based DCs" }
    ]
  },
  {
    id: "stupefied",
    name: "Stupefied",
    url: "/conditions/38-stupefied",
    summary: "Your thoughts and instincts are clouded. You take a status penalty equal to this value on Intelligence-, Wisdom-, and Charisma-based checks and DCs.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-indigo-500",
    effects: [
      { type: "status", target: "mental_checks", valuePerUnit: -1, description: "–X status penalty to INT/WIS/CHA-based checks" },
      { type: "status", target: "mental_dcs", valuePerUnit: -1, description: "–X status penalty to INT/WIS/CHA-based DCs" }
    ]
  },
  {
    id: "drained",
    name: "Drained",
    url: "/conditions/10-drained",
    summary: "Your health and vitality have been depleted. You take a status penalty equal to your drained value to Fortitude saves, and your maximum HP is reduced.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-red-700",
    effects: [
      { type: "status", target: "fortitude", valuePerUnit: -1, description: "–X status penalty to Fortitude saves" }
    ],
    specialEffects: ["Maximum HP reduced by X × level (approximate)"]
  },
  {
    id: "doomed",
    name: "Doomed",
    url: "/conditions/9-doomed",
    summary: "Your soul is closer to death. The dying value at which you die is reduced by your doomed value.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-black",
    effects: [],
    specialEffects: ["Dying value reduced by X (normally die at Dying 4, now at Dying 4-X)"]
  },
  {
    id: "dying",
    name: "Dying",
    url: "/conditions/11-dying",
    summary: "You're at death's door. You're unconscious. If your dying value ever reaches 4 (or 4 minus your doomed value), you die.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-red-900",
    effects: [],
    specialEffects: ["Unconscious", "Die at Dying 4 (or lower if Doomed)", "Recovery check each turn"]
  },
  {
    id: "off-guard",
    name: "Off-Guard",
    url: "/conditions/28-off-guard",
    summary: "You're distracted and unable to focus on defense. You take a –2 circumstance penalty to AC.",
    hasValue: false,
    color: "bg-yellow-600",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC" }
    ]
  },
  {
    id: "prone",
    name: "Prone",
    url: "/conditions/32-prone",
    summary: "You're lying on the ground. You are off-guard and take a –2 circumstance penalty to attack rolls.",
    hasValue: false,
    color: "bg-amber-700",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" },
      { type: "circumstance", target: "attack", valuePerUnit: -2, description: "–2 circumstance penalty to attack rolls" }
    ],
    specialEffects: ["Can only use crawl move action (5 feet)", "Ranged attacks within 10 feet have no penalty"]
  },
  {
    id: "fatigued",
    name: "Fatigued",
    url: "/conditions/15-fatigued",
    summary: "You are tired. You take a –1 status penalty to AC and saving throws.",
    hasValue: false,
    color: "bg-stone-500",
    effects: [
      { type: "status", target: "ac", valuePerUnit: -1, description: "–1 status penalty to AC" },
      { type: "status", target: "all_saves", valuePerUnit: -1, description: "–1 status penalty to all saving throws" }
    ]
  },
  {
    id: "unconscious",
    name: "Unconscious",
    url: "/conditions/40-unconscious",
    summary: "You're sleeping or knocked out. You can't act. You take a –4 status penalty to AC, Perception, and Reflex saves, and you have the blinded and off-guard conditions.",
    hasValue: false,
    color: "bg-slate-700",
    effects: [
      { type: "status", target: "ac", valuePerUnit: -4, description: "–4 status penalty to AC" },
      { type: "status", target: "perception", valuePerUnit: -4, description: "–4 status penalty to Perception" },
      { type: "status", target: "reflex", valuePerUnit: -4, description: "–4 status penalty to Reflex saves" },
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" }
    ],
    specialEffects: ["Blinded", "Off-guard", "Can't act"]
  },
  {
    id: "fascinated",
    name: "Fascinated",
    url: "/conditions/14-fascinated",
    summary: "You're compelled to focus your attention on something. You take a –2 status penalty to Perception and skill checks.",
    hasValue: false,
    color: "bg-pink-400",
    effects: [
      { type: "status", target: "perception", valuePerUnit: -2, description: "–2 status penalty to Perception checks" },
      { type: "status", target: "all_checks", valuePerUnit: -2, description: "–2 status penalty to skill checks (conditional)" }
    ]
  },
  {
    id: "slowed",
    name: "Slowed",
    url: "/conditions/36-slowed",
    summary: "You have fewer actions. When you regain your actions, reduce the number of actions regained by your slowed value.",
    hasValue: true,
    valueLabel: "Actions lost",
    color: "bg-blue-600",
    effects: [],
    specialEffects: ["Lose X actions at the start of each turn"]
  },
  {
    id: "stunned",
    name: "Stunned",
    url: "/conditions/37-stunned",
    summary: "You've become senseless. You can't act. The value indicates how many total actions you lose.",
    hasValue: true,
    valueLabel: "Actions lost",
    color: "bg-violet-700",
    effects: [],
    specialEffects: ["Can't act", "Lose X total actions (possibly over multiple turns)"]
  },
  {
    id: "grabbed",
    name: "Grabbed",
    url: "/conditions/20-grabbed",
    summary: "You're held in place by another creature, giving you the off-guard and immobilized conditions.",
    hasValue: false,
    color: "bg-amber-800",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" }
    ],
    specialEffects: ["Immobilized", "Off-guard", "–2 circumstance penalty on Escape checks"]
  },
  {
    id: "immobilized",
    name: "Immobilized",
    url: "/conditions/24-immobilized",
    summary: "You're incapable of movement. You can't use any actions that have the move trait.",
    hasValue: false,
    color: "bg-stone-600",
    effects: [],
    specialEffects: ["Can't use move actions", "Escape DC is the grabber's Athletics DC"]
  },
  {
    id: "restrained",
    name: "Restrained",
    url: "/conditions/34-restrained",
    summary: "You are tied up or pinned. You have the off-guard and immobilized conditions, and you can't use any attack or manipulate actions.",
    hasValue: false,
    color: "bg-amber-900",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" }
    ],
    specialEffects: ["Immobilized", "Off-guard", "Can't use attack or manipulate actions"]
  },
  {
    id: "paralyzed",
    name: "Paralyzed",
    url: "/conditions/29-paralyzed",
    summary: "You're frozen in place. You have the off-guard condition and can't act except to Recall Knowledge and use actions that require only your mind.",
    hasValue: false,
    color: "bg-cyan-700",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" }
    ],
    specialEffects: ["Off-guard", "Can only use Recall Knowledge and mental actions", "Auto critical fail on Reflex saves vs. paralysis effects"]
  },
  {
    id: "invisible",
    name: "Invisible",
    url: "/conditions/26-invisible",
    summary: "You can't be seen. You're undetected to everyone.",
    hasValue: false,
    color: "bg-sky-300",
    effects: [],
    specialEffects: ["Undetected by all creatures", "Creatures can Seek to detect you"]
  },
  {
    id: "hidden",
    name: "Hidden",
    url: "/conditions/22-hidden",
    summary: "You're hidden from a creature. That creature knows the space you're in but can't tell precisely where you are.",
    hasValue: false,
    color: "bg-teal-600",
    effects: [],
    specialEffects: ["Enemies know your space but not exact location", "Flat check to target you"]
  },
  {
    id: "concealed",
    name: "Concealed",
    url: "/conditions/4-concealed",
    summary: "You're difficult to see due to fog or other obscuring features.",
    hasValue: false,
    color: "bg-gray-400",
    effects: [],
    specialEffects: ["Flat check (DC 5) to target you"]
  },
  {
    id: "quickened",
    name: "Quickened",
    url: "/conditions/33-quickened",
    summary: "You're able to act more quickly. You gain 1 additional action at the start of your turn each round.",
    hasValue: false,
    color: "bg-emerald-500",
    effects: [],
    specialEffects: ["Gain 1 additional action each turn"]
  },
  {
    id: "persistent-damage",
    name: "Persistent Damage",
    url: "/conditions/30-persistent-damage",
    summary: "You're taking damage from an ongoing effect, such as being lit on fire.",
    hasValue: true,
    valueLabel: "Damage",
    valueInputType: "text",
    color: "bg-orange-600",
    effects: [],
    specialEffects: ["Take X damage at the start of each turn", "Requires flat check (DC 15) to end"]
  },
  {
    id: "confused",
    name: "Confused",
    url: "/conditions/5-confused",
    summary: "You don't have your wits about you. You're off-guard, you don't treat anyone as your ally, and you attack wildly.",
    hasValue: false,
    color: "bg-fuchsia-600",
    effects: [
      { type: "circumstance", target: "ac", valuePerUnit: -2, description: "–2 circumstance penalty to AC (off-guard)" }
    ],
    specialEffects: ["Off-guard", "Don't treat anyone as ally", "Attack nearest creature each turn"]
  },
  {
    id: "encumbered",
    name: "Encumbered",
    url: "/conditions/12-encumbered",
    summary: "You're carrying more weight than you can manage. You are clumsy 1 and take a 10-foot penalty to all your Speeds.",
    hasValue: false,
    color: "bg-yellow-800",
    effects: [
      { type: "status", target: "dexterity_checks", valuePerUnit: -1, description: "–1 status penalty to Dexterity-based checks (clumsy 1)" },
      { type: "status", target: "reflex", valuePerUnit: -1, description: "–1 status penalty to Reflex saves (clumsy 1)" },
      { type: "untyped", target: "speed", valuePerUnit: -10, description: "–10 foot penalty to all Speeds" }
    ]
  },
  {
    id: "controlled",
    name: "Controlled",
    url: "/conditions/6-controlled",
    summary: "You've been commanded or magically dominated. The controller dictates how you act.",
    hasValue: false,
    color: "bg-rose-700",
    effects: [],
    specialEffects: ["Controller dictates your actions"]
  },
  {
    id: "petrified",
    name: "Petrified",
    url: "/conditions/31-petrified",
    summary: "You've been turned to stone. You can't act, nor can you sense anything. You become an object.",
    hasValue: false,
    color: "bg-stone-400",
    effects: [],
    specialEffects: ["Can't act or sense", "Become object with double Bulk", "Resistance to all damage"]
  },
  {
    id: "fleeing",
    name: "Fleeing",
    url: "/conditions/16-fleeing",
    summary: "You're forced to run away due to fear or compulsion. On your turn, you must spend each of your actions trying to escape.",
    hasValue: false,
    color: "bg-red-500",
    effects: [],
    specialEffects: ["Must use all actions to escape", "Can't use other actions"]
  },
  {
    id: "wounded",
    name: "Wounded",
    url: "/conditions/45-wounded",
    summary: "You've been seriously injured. This is a reminder condition for recovery.",
    hasValue: true,
    valueLabel: "Value",
    color: "bg-red-400",
    effects: [],
    specialEffects: ["Reminder: recover HP when healed from dying"]
  }
];

// Helper to find a condition by ID
export function getConditionById(id: string): Condition | undefined {
  return CONDITIONS.find(c => c.id === id);
}

// Helper to search conditions by name
export function searchConditions(query: string): Condition[] {
  const q = query.toLowerCase().trim();
  if (!q) return CONDITIONS;
  return CONDITIONS.filter(c => c.name.toLowerCase().includes(q));
}
