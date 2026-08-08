import crypto from "node:crypto";
import { eq, and, gte } from "drizzle-orm";
import { db } from "../../db/client";
import { users, magicLinkTokens } from "../../db/schema";
import { getUserId } from "~/lib/session.server";

const TOKEN_TTL_MS = 15 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

export async function findUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()));
  return rows[0] ?? null;
}

export async function isRateLimited(userId: string) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recent = await db
    .select()
    .from(magicLinkTokens)
    .where(and(eq(magicLinkTokens.userId, userId), gte(magicLinkTokens.createdAt, since)));

  return recent.length >= RATE_LIMIT_MAX_REQUESTS;
}

export async function createMagicLinkToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await db.insert(magicLinkTokens).values({ userId, token, expiresAt });
  return token;
}

export async function consumeMagicLinkToken(token: string) {
  const rows = await db.select().from(magicLinkTokens).where(eq(magicLinkTokens.token, token));
  const record = rows[0];

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  await db.update(magicLinkTokens).set({ usedAt: new Date() }).where(eq(magicLinkTokens.id, record.id));
  return record.userId;
}

export async function getCurrentUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  const rows = await db.select().from(users).where(eq(users.id, userId));
  return rows[0] ?? null;
}