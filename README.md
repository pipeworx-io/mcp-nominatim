# mcp-nominatim

Nominatim MCP — wraps OpenStreetMap Nominatim geocoding API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_address` | Search for coordinates of an address or place name. Returns latitude, longitude, display name, and place type for matched locations. |
| `reverse_geocode` | Convert latitude/longitude coordinates to a human-readable address. Returns nearest address, place name, and administrative boundaries. |
| `lookup` | Get details for OpenStreetMap locations by ID (e.g., "N123456" for node, "W654321" for way, "R111" for relation). Returns coordinates, names, and metadata. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nominatim": {
      "url": "https://gateway.pipeworx.io/nominatim/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nominatim data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
