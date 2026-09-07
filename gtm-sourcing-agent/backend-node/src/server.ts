// Port of api.py's app setup. Mirrors: CORS origin allowlist, cookie
// parsing, the AuthMiddleware hook applied to every route, and the
// health/root routes Render's platform probes hit (see api.py:519-530
// and the earlier session's fix for exactly why both need to answer
// GET+HEAD and be public).
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { authHook } from "./lib/authMiddleware.js";
import { registerAuthRoutes } from "./routes/auth.js";

const CORS_ORIGINS = (process.env.GTM_CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: CORS_ORIGINS, credentials: true });
  app.register(cookie);

  app.addHook("onRequest", authHook);

  app.route({
    method: ["GET", "HEAD"],
    url: "/health",
    handler: async () => ({ status: "ok" }),
  });
  app.route({
    method: ["GET", "HEAD"],
    url: "/",
    handler: async () => ({ status: "ok", service: "Talyn API (Node)" }),
  });

  app.register(registerAuthRoutes);

  app.setErrorHandler((error: any, request, reply) => {
    const status = error.statusCode ?? 500;
    if (error.issues) {
      // zod validation error
      reply.code(400).send({ detail: error.issues });
      return;
    }
    reply.code(status).send({ detail: error.message });
  });

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = buildServer();
  const port = Number(process.env.PORT ?? 8001);
  app.listen({ port, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}
