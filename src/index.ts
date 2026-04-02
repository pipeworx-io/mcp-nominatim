/**
 * Nominatim MCP — wraps OpenStreetMap Nominatim geocoding API (free, no auth)
 *
 * Tools:
 * - search_address: Forward geocode a free-form address or place name
 * - reverse_geocode: Reverse geocode lat/lon coordinates to an address
 * - lookup: Look up OSM objects by their IDs
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'pipeworx-mcp/1.0' };

type RawPlace = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: Record<string, string>;
};

function formatPlace(p: RawPlace) {
  return {
    place_id: p.place_id,
    osm_type: p.osm_type,
    osm_id: p.osm_id,
    lat: parseFloat(p.lat),
    lon: parseFloat(p.lon),
    display_name: p.display_name,
    type: p.type,
    importance: p.importance,
    ...(p.address ? { address: p.address } : {}),
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'search_address',
    description:
      'Forward geocode a free-form address or place name using OpenStreetMap Nominatim. Returns matching places with coordinates.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Free-form address or place name to search for (e.g. "Eiffel Tower, Paris").',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Defaults to 5, max 50.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'reverse_geocode',
    description:
      'Reverse geocode a latitude/longitude coordinate pair to a human-readable address using OpenStreetMap Nominatim.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: {
          type: 'number',
          description: 'Latitude in decimal degrees (e.g. 48.8584).',
        },
        lon: {
          type: 'number',
          description: 'Longitude in decimal degrees (e.g. 2.2945).',
        },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'lookup',
    description:
      'Look up one or more OpenStreetMap objects by their OSM IDs (e.g. "N123456,W654321,R111"). Prefix N=node, W=way, R=relation.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: 'string',
          description:
            'Comma-separated list of OSM IDs with type prefix (e.g. "N123456,W654321"). N=node, W=way, R=relation.',
        },
      },
      required: ['ids'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_address':
      return searchAddress(args.query as string, (args.limit as number | undefined) ?? 5);
    case 'reverse_geocode':
      return reverseGeocode(args.lat as number, args.lon as number);
    case 'lookup':
      return lookup(args.ids as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchAddress(query: string, limit: number) {
  const params = new URLSearchParams({ q: query, format: 'json', limit: String(limit) });
  const res = await fetch(`${BASE_URL}/search?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim API error: ${res.status}`);

  const data = (await res.json()) as RawPlace[];
  return { results: data.map(formatPlace) };
}

async function reverseGeocode(lat: number, lon: number) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), format: 'json' });
  const res = await fetch(`${BASE_URL}/reverse?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim API error: ${res.status}`);

  const data = (await res.json()) as RawPlace & { error?: string };
  if (data.error) throw new Error(`Nominatim API error: ${data.error}`);

  return formatPlace(data);
}

async function lookup(ids: string) {
  const params = new URLSearchParams({ osm_ids: ids, format: 'json' });
  const res = await fetch(`${BASE_URL}/lookup?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim API error: ${res.status}`);

  const data = (await res.json()) as RawPlace[];
  return { results: data.map(formatPlace) };
}

export default { tools, callTool } satisfies McpToolExport;
