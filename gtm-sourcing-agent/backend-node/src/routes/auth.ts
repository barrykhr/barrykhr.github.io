// Port of api.py's /auth/* and /users routes (lines 168-317 in the
// Python source). Request bodies below mirror api.py's Pydantic
// BaseModel classes field-for-field.
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import * as auth from "../auth/service.js";
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "../auth/service.js";
import { requireRole } from "../lib/authMiddleware.js";

const SignupRequest = z.object({
  email: z.string(),
  password: z.string(),
  signup_code: z.string().nullable().optional(),
});
const LoginRequest = z.object({ email: z.string(), password: z.string() });
const GoogleAuthRequest = z.object({ credential: z.string() });
const ForgotPasswordRequest = z.object({ email: z.string() });
const ResetPasswordRequest = z.object({ token: z.string(), new_password: z.string() });
const UserRoleRequest = z.object({ role: z.string() });

const COOKIE_SECURE = (process.env.GTM_COOKIE_SECURE ?? "false").toLowerCase() === "true";
let COOKIE_SAMESITE = (process.env.GTM_COOKIE_SAMESITE ?? "lax").toLowerCase();
const cookieSecure = COOKIE_SAMESITE === "none" ? true : COOKIE_SECURE;

function setSessionCookie(reply: any, token: string) {
  reply.setCookie(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    secure: cookieSecure,
    sameSite: COOKIE_SAMESITE as "lax" | "strict" | "none",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

function mapAuthError(e: unknown): never {
  if (e instanceof auth.AuthError) {
    const err: any = new Error(e.message);
    err.statusCode = 400;
    throw err;
  }
  throw e;
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.get("/auth/status", async () => ({
    signup_requires_code: auth.signupRequiresCode(),
    google_client_id: auth.GOOGLE_CLIENT_ID,
  }));

  app.post("/auth/signup", async (request, reply) => {
    const body = SignupRequest.parse(request.body);
    try {
      const user = await auth.createUser(body.email, body.password, body.signup_code ?? null);
      const token = await auth.createSession(user.id);
      setSessionCookie(reply, token);
      // TODO(phase 3 follow-up): admin new-signup notification (notifications.py port)
      return user;
    } catch (e) {
      mapAuthError(e);
    }
  });

  app.post("/auth/login", async (request, reply) => {
    const body = LoginRequest.parse(request.body);
    const user = await auth.verifyCredentials(body.email, body.password);
    if (!user) {
      const err: any = new Error("incorrect email or password");
      err.statusCode = 401;
      throw err;
    }
    const token = await auth.createSession(user.id);
    setSessionCookie(reply, token);
    return user;
  });

  app.post("/auth/google", async (request, reply) => {
    const body = GoogleAuthRequest.parse(request.body);
    try {
      const user = await auth.googleLogin(body.credential);
      const { _is_new_account, ...publicUser } = user;
      const token = await auth.createSession(publicUser.id);
      setSessionCookie(reply, token);
      return publicUser;
    } catch (e) {
      mapAuthError(e);
    }
  });

  app.post("/auth/forgot-password", async (request) => {
    const body = ForgotPasswordRequest.parse(request.body);
    // Same anti-enumeration contract as Python: always the same response.
    // Real send wiring (notifications.ts) is a follow-up item in this
    // phase's port — see docs/migration.md phase notes.
    await auth.createPasswordResetToken(body.email);
    return { status: "if an account exists for that email, we've sent a reset link" };
  });

  app.post("/auth/reset-password", async (request) => {
    const body = ResetPasswordRequest.parse(request.body);
    try {
      await auth.resetPassword(body.token, body.new_password);
      return { status: "password reset — log in with your new password" };
    } catch (e) {
      mapAuthError(e);
    }
  });

  app.post("/auth/logout", async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE_NAME];
    if (token) await auth.deleteSession(token);
    reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return { status: "logged out" };
  });

  app.get("/auth/me", async (request) => {
    return (request as any).user;
  });

  app.get("/users", { preHandler: requireRole("admin") }, async () => {
    return auth.listUsers();
  });

  app.patch("/users/:userId/role", { preHandler: requireRole("admin") }, async (request) => {
    const { userId } = request.params as { userId: string };
    const body = UserRoleRequest.parse(request.body);
    try {
      return await auth.setUserRole(userId, body.role);
    } catch (e) {
      mapAuthError(e);
    }
  });
}
