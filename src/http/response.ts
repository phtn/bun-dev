import { type ReactElement, createElement } from "react";

/**
 * Serve any matching file in the public directory.
 * If nothing matches, return a 404.
 */
export function serve_static(static_dir: string, req: Request): Response {
  const url = new URL(req.url);
  const file = Bun.file(`${static_dir}${url.pathname}`);
  if (file.size === 0) {
    console.log(`[static]: no file found: ${req.method}: ${req.url}`);
    return html(createElement("div", null, "404"), 404);
  }
  return new Response(file);
}

/**
 * Return an HTML response with the given status code and JSX component.
 * Uses react-dom renderToString to render the component to HTML.
 */
export function html(component: ReactElement, status = 200): Response {
  return new Response(JSON.stringify(component, null, 2), {
    status,
    headers: { "Content-Type": "text/html" },
  });
}
