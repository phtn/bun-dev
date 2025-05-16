import { dlopen, FFIType, suffix } from "bun:ffi";
const { cstring } = FFIType;

export async function ts_to_pg(ts: string): Promise<string> {
  const path = `libts_to_pg.${suffix}`;
  const file = Bun.file(ts);
  const arrbuf = await file.arrayBuffer();
  const buf = Buffer.from(arrbuf);

  const lib = dlopen(path, {
    ts_2_pg: {
      args: [cstring],
      returns: cstring,
    },
  });
  return lib.symbols.ts_2_pg(buf).toString();
}
