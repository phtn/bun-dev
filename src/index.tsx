import { ts_to_zod } from "./utils/ts_to_zod";

const config = { port: 8080, hostname: "localhost" };

const server = Bun.serve({
  ...config,
  async fetch(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/ts-to-zod") {
      if (req.method === "POST") {
        const body = await req.text();
        const result = await ts_to_zod(body);
        return new Response(result, {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("Method not allowed", { status: 405 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

export default server;
