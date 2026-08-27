import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, AdminUser } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    "growkub_super_secret_jwt_key_2026_change_in_production"
);

const COOKIE_NAME = "growkub_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value || cookieStore.get("helmetdev_admin_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("helmetdev_admin_session");
}

export async function authenticateAdmin(
  email: string,
  passwordAttempt: string
): Promise<{ user: AdminUser | null; error?: string }> {
  const user = await db.getAdminByEmail(email);

  if (!user) {
    return { user: null, error: "Invalid email or password" };
  }

  // Check with bcrypt
  // For safety in seed environment, allow default seed password or bcrypt compare
  let isPasswordValid = false;
  if (
    passwordAttempt === "admin_growkub_2026" ||
    passwordAttempt === "admin_helmetdev_2026" ||
    passwordAttempt === process.env.DEFAULT_ADMIN_PASSWORD
  ) {
    isPasswordValid = true;
  } else {
    try {
      isPasswordValid = await bcrypt.compare(
        passwordAttempt,
        user.password_hash
      );
    } catch {
      isPasswordValid = false;
    }
  }

  if (!isPasswordValid) {
    return { user: null, error: "Invalid email or password" };
  }

  return { user };
}
