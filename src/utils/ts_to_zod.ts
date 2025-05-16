import t2z from "ts-to-zod";
import { readdir, mkdir } from "node:fs/promises";
import type { BunFile } from "bun";

const DEFAULT_OUTPUT_PATH = "outputs/zod";
export const ts_to_zod = async (source: string, dest = DEFAULT_OUTPUT_PATH) => {
  const zodfile = await convertToZod(source);

  const rootDirs = await readdir("./src", { recursive: true });
  const outputPath = `./src/${dest}/`;
  if (rootDirs.includes(dest)) {
    await Bun.write(`${outputPath}/zod.ts`, zodfile);
    console.log("\n->\tValidation ->\tDirectory exits");
    console.log(`->\tPath ->\t${outputPath} \n`);
  } else {
    console.log("\n->\tDirectory doesn't exits");
    console.log("->\tCreating directory  ...");
    console.log(`->\tPath ->\t${outputPath} \n`);
    await mkdir(outputPath, {
      recursive: true,
    });
    await Bun.write(`${outputPath}/zod.ts`, zodfile);
  }
  return zodfile;
};

const convertToZod = async (path: string) => {
  const file = Bun.file(path);
  const arrbuf = await file.arrayBuffer();
  const buf = Buffer.from(arrbuf);
  return t2z
    .generate({ sourceText: buf.toString() })
    .getZodSchemasFile("zod.ts");
};
