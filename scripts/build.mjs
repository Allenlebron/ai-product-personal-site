import { readdir, lstat, readFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const pages = ["index.html", "intel.html", "trial.html", "404.html"];
const extensions = {
  css: new Set([".css"]),
  js: new Set([".js"]),
  assets: new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico"]),
};
// Heuristic release guard, not proof that every possible credential is absent.
const secret = /sk_live_[A-Za-z0-9]+|sk-[A-Za-z0-9_-]{16,}|sb_secret_[A-Za-z0-9_-]+|service_role|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;

function hasSecret(text) {
  if (secret.test(text)) return true;
  // Legacy Supabase service keys are JWTs whose decoded role is service_role.
  return [...text.matchAll(/eyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)]
    .some((match) => Buffer.from(match[1], "base64url").toString().includes("service_role"));
}

export async function buildSite(root = projectRoot) {
  const output = path.join(root, "dist");
  await rm(output, { recursive: true, force: true });
  const files = [];

  async function collect(relative, allowed) {
    const source = path.join(root, relative);
    const stat = await lstat(source);
    if (stat.isSymbolicLink()) throw new Error(`Symbolic link is not publishable: ${relative}`);
    if (stat.isDirectory()) {
      for (const name of await readdir(source)) {
        if (!name.startsWith(".")) await collect(path.join(relative, name), allowed);
      }
    } else if (stat.isFile() && (!allowed || allowed.has(path.extname(relative)))) {
      const content = await readFile(source);
      const text = content.toString("utf8");
      if (hasSecret(text)) throw new Error(`Potential secret in ${relative}; build stopped (value redacted)`);
      if (/sourceMappingURL\s*=/.test(text)) throw new Error(`Source map reference in ${relative}; build stopped`);
      files.push([relative, content]);
    }
  }

  for (const page of pages) await collect(page);
  for (const [directory, allowed] of Object.entries(extensions)) await collect(directory, allowed);
  for (const [relative, content] of files) {
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
  return files.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(`Built ${await buildSite()} public files into dist/`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
