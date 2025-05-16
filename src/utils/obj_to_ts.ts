import { dlopen, FFIType, suffix } from "bun:ffi";
const { cstring } = FFIType;

export async function obj_to_ts(json: string) {
  const path = `libobj_to_ts.${suffix}`;
  const file = Bun.file(json);
  const arrbuf = await file.arrayBuffer();
  const buf = Buffer.from(arrbuf);

  const lib = dlopen(path, {
    obj_2_ts: {
      args: [cstring],
      returns: cstring,
    },
  });
  return lib.symbols.obj_2_ts(buf).toString();
}
