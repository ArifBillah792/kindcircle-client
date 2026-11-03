import dns from "node:dns";

// The router on this machine (the default DNS server) refuses SRV lookups, so
// point Node at public resolvers before MongoDB resolves the Atlas connection
// string.
const DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

// On Windows the first lookup right after dns.setServers() can still be sent to
// the old DNS servers and fail with `querySrv ECONNREFUSED`. Retrying makes
// Node pick up the new resolvers.
const MAX_ATTEMPTS = 5;

function getAtlasSrvName() {
  const uri = process.env.MONGODB_URI || "";

  if (!uri.startsWith("mongodb+srv://")) {
    return null;
  }

  const host = uri
    .slice("mongodb+srv://".length)
    .split("/")[0]
    .split("@")
    .pop();

  return host ? `_mongodb._tcp.${host}` : null;
}

/**
 * Point Node at public DNS servers and warm the resolver up.
 *
 * Call this before anything touches the database. Resolving the Atlas SRV
 * record once here means the first real query already works.
 */
export async function ensureDnsServers() {
  dns.setServers(DNS_SERVERS);

  const srvName = getAtlasSrvName();

  if (!srvName) {
    return;
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      await dns.promises.resolveSrv(srvName);
      return;
    } catch {
      dns.setServers(DNS_SERVERS);
    }
  }
}
