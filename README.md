# @pipeworx/mcp-nominatim

MCP server for geocoding and reverse geocoding via the [OpenStreetMap Nominatim API](https://nominatim.openstreetmap.org/). Free, no authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `search_address` | Forward geocode a free-form address or place name to coordinates |
| `reverse_geocode` | Reverse geocode lat/lon coordinates to a human-readable address |
| `lookup` | Look up OpenStreetMap objects by their OSM IDs |

## Quickstart via Pipeworx Gateway

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "nominatim__search_address",
      "arguments": { "query": "Eiffel Tower, Paris", "limit": 3 }
    },
    "id": 1
  }'
```

## License

MIT
