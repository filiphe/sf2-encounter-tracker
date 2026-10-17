const AON_SEARCH_ENDPOINT = "https://elasticsearch.aonprd.com/aonsf/_search?index=aonsf10";
const AON_BASE_URL = "https://2e.aonsrd.com";

export interface AbilityResult {
  id: string;
  name: string;
  category: string;
  type: string;
  url: string;
  fullUrl: string;
  actions?: string;
  actionsNumber?: number;
  traits?: string[];
  source?: string[];
  summary?: string;
  prerequisites?: string;
}

export interface CreatureResult {
  name: string;
  url: string;
  fullUrl: string;
}

// Cache for ability searches to avoid repeated requests
const abilityCache = new Map<string, AbilityResult | null>();
const creatureCache = new Map<string, CreatureResult | null>();

/**
 * Search for an ability/action/feat by name in the AoN Elasticsearch index.
 * Returns the best match or null if not found.
 */
export async function searchAbility(name: string): Promise<AbilityResult | null> {
  // Normalize the name for caching and searching
  const normalizedName = name.trim().replace(/[!?.]+$/, "").toLowerCase();
  
  if (abilityCache.has(normalizedName)) {
    return abilityCache.get(normalizedName)!;
  }

  try {
    // Search across multiple categories that could contain abilities
    const query = {
      size: 5,
      query: {
        bool: {
          should: [
            { match_phrase: { name: name.trim() } },
            { match_phrase: { name: normalizedName } }
          ],
          minimum_should_match: 1
        }
      },
      _source: [
        "name", "category", "type", "url", "actions", "actions_number",
        "trait", "source", "summary", "prerequisites", "requirement"
      ]
    };

    const response = await fetch(AON_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "sf2-encounter-tracker/1.0"
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      console.error("Ability search failed:", response.status);
      abilityCache.set(normalizedName, null);
      return null;
    }

    const data = await response.json();
    const hits = data?.hits?.hits || [];

    if (hits.length === 0) {
      abilityCache.set(normalizedName, null);
      return null;
    }

    // Find the best match - prefer exact name match
    let bestMatch = hits[0];
    for (const hit of hits) {
      const hitName = (hit._source?.name || "").toLowerCase().replace(/[!?.]+$/, "");
      if (hitName === normalizedName) {
        bestMatch = hit;
        break;
      }
    }

    const source = bestMatch._source;
    const result: AbilityResult = {
      id: bestMatch._id,
      name: source.name,
      category: source.category,
      type: source.type || source.category,
      url: source.url,
      fullUrl: AON_BASE_URL + source.url,
      actions: source.actions,
      actionsNumber: source.actions_number,
      traits: source.trait,
      source: source.source,
      summary: source.summary,
      prerequisites: source.prerequisites || source.requirement
    };

    abilityCache.set(normalizedName, result);
    return result;
  } catch (error) {
    console.error("Error searching for ability:", error);
    abilityCache.set(normalizedName, null);
    return null;
  }
}

/**
 * Search for a creature by name to get its AoN URL.
 */
export async function searchCreature(name: string): Promise<CreatureResult | null> {
  const normalizedName = name.trim().toLowerCase();
  
  if (creatureCache.has(normalizedName)) {
    return creatureCache.get(normalizedName)!;
  }

  try {
    const query = {
      size: 1,
      query: {
        bool: {
          must: [
            { match: { category: "creature" } },
            { match_phrase: { name: name.trim() } }
          ]
        }
      },
      _source: ["name", "url"]
    };

    const response = await fetch(AON_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "sf2-encounter-tracker/1.0"
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      creatureCache.set(normalizedName, null);
      return null;
    }

    const data = await response.json();
    const hit = data?.hits?.hits?.[0];

    if (!hit) {
      creatureCache.set(normalizedName, null);
      return null;
    }

    const result: CreatureResult = {
      name: hit._source.name,
      url: hit._source.url,
      fullUrl: AON_BASE_URL + hit._source.url
    };

    creatureCache.set(normalizedName, result);
    return result;
  } catch (error) {
    console.error("Error searching for creature:", error);
    creatureCache.set(normalizedName, null);
    return null;
  }
}

/**
 * Parse creature_ability field into individual entries.
 * Handles both string (comma-separated) and array formats.
 */
export function parseCreatureAbilities(creatureAbility: string | string[] | undefined): string[] {
  if (!creatureAbility) return [];
  
  if (Array.isArray(creatureAbility)) {
    return creatureAbility.map(a => String(a).trim()).filter(a => a.length > 0);
  }
  
  // String format: split by comma
  return String(creatureAbility)
    .split(",")
    .map(a => a.trim())
    .filter(a => a.length > 0);
}

/**
 * Determine if a creature ability entry is an attack (strike) or an ability.
 * Attacks typically have a pattern like "fist +7" or "jaws +6 (agile)".
 */
export function isAttack(entry: string): boolean {
  // Attack pattern: contains " +number" (space, plus, digits)
  return /\s+\+\d+/.test(entry);
}

/**
 * Clean an ability name for display and searching.
 * Removes trailing punctuation and attack bonuses.
 */
export function cleanAbilityName(entry: string): string {
  return entry
    .replace(/\s+\+\d+.*$/, "") // Remove attack bonus and traits
    .replace(/[!?.]+$/, "")     // Remove trailing punctuation
    .trim();
}
