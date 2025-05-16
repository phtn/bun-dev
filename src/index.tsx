import { obj_to_ts } from "./utils/obj_to_ts";
import { ts_to_zod } from "./utils/ts_to_zod";

const config = { port: 8080, hostname: "localhost" };

const server = Bun.serve({
  ...config,
  async fetch(req: Request) {
    const body = await req.text();
    const url = new URL(req.url);

    if (req.method === "POST") {
      switch (url.pathname) {
        case "/ts-to-zod": {
          const result = await ts_to_zod(body);
          return new Response(result, {
            headers: { "Content-Type": "application/json" },
          });
        }
        case "/obj-to-ts": {
          const result = await obj_to_ts(body);
          return new Response(result, {
            headers: { "Content-Type": "application/json" },
          });
        }
        default:
          return new Response(`API endpoint (${body}) - not found.`, {
            status: 404,
          });
      }
    }
    return new Response("Method not allowed", { status: 405 });
  },
});

export default server;
