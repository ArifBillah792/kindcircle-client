import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { auth } from "@/lib/auth";

// GET /api/token → gives the logged-in user a JWT for the Express server
export async function GET() {
  // 1. Who is logged in? (read from the BetterAuth session cookie)
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return Response.json({ message: "Unauthorized access" }, { status: 401 });
  }

  // 2. Put the user's info in a token, signed with our secret, valid for 1 hour
  const { email, name, image } = session.user;
  const token = jwt.sign({ email, name, image }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return Response.json({ token });
}
