import fs from "fs/promises";
import path from "path";

export const deleteFiles = async (urls: string[]) => {
  await Promise.all(
    urls.map((url) => fs.unlink(path.join(process.cwd(), url)).catch(() => undefined))
  );
};