import dns from "node:dns";

import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

// This machine cannot resolve MongoDB Atlas SRV records with the default DNS
// servers, so point Node at public resolvers before creating the client.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    // The assignment allows 6-character passwords; BetterAuth defaults to 8.
    minPasswordLength: 6,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [jwt(), nextCookies()],
});
