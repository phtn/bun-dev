import t2z from "ts-to-zod";
import { readdir, mkdir } from "node:fs/promises";

const DEFAULT_OUTPUT_PATH = "outputs/zod";
export const ts_to_zod = async (
  source: string,
  dest = DEFAULT_OUTPUT_PATH,
): Promise<string> => {
  const zodfile = await convertToZod(source);

  const rootDirs = await readdir("./src", { recursive: true });
  const outputPath = `./src/${dest}/`;
  let bytes = 0;
  if (rootDirs.includes(dest)) {
    console.log("\n|> Validation \t->\tPath exits");
    console.log(`|> Path \t->\t${outputPath}`);
    console.log("|> Action \t->\tWriting file  ...\n");
    bytes = await Bun.write(`${outputPath}/zod.ts`, zodfile);
    console.log(`|> Done \t->\twritten ${bytes} bytes\n`);
  } else {
    console.log("\n|> Validation \t->\tPath exits");
    console.log("|> Action \t->\tCreating directory  ...");
    console.log(`|> Path \t->\t${outputPath} \n`);
    await mkdir(outputPath, {
      recursive: true,
    });

    console.log("|> Action\t->\tWriting file  ...");
    bytes = await Bun.write(`${outputPath}/zod.ts`, zodfile);
    console.log(`|> Done \t->\twritten ${bytes} bytes\n`);
  }
  return zodfile;
};

const convertToZod = async (path: string): Promise<string> => {
  const file = Bun.file(path);
  const arrbuf = await file.arrayBuffer();
  const buf = Buffer.from(arrbuf);
  return t2z
    .generate({ sourceText: buf.toString() })
    .getZodSchemasFile("zod.ts");
};
