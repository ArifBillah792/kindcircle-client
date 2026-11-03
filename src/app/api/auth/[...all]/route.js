import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { ensureDnsServers } from "@/lib/dns";

const handlers = toNextJsHandler(auth);

// Warm the DNS resolver up before the first database call, once per server.
let dnsReady = null;

function prepareDatabase() {
  if (!dnsReady) {
    dnsReady = ensureDnsServers();
  }

  return dnsReady;
}

export async function GET(request) {
  await prepareDatabase();
  return handlers.GET(request);
}

export async function POST(request) {
  await prepareDatabase();
  return handlers.POST(request);
}
