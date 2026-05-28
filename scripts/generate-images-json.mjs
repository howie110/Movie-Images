import { readdir, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ignoredDirectories = new Set([".git", "node_modules", ".vercel"]);

const images = await collectImages(root);

await writeFile(
  join(root, "images.json"),
  `${JSON.stringify(images, null, 2)}\n`,
  "utf8",
);

async function collectImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectImages(join(directory, entry.name))));
      }
      continue;
    }

    if (entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(`./${relative(root, join(directory, entry.name)).split(sep).join("/")}`);
    }
  }

  return files.sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}
