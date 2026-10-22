import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildSite } from "./build.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "website-security-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const page of ["index.html", "intel.html", "trial.html", "404.html"]) {
    await writeFile(path.join(root, page), "<!doctype html><title>Public</title>");
  }
  for (const dir of ["css", "js", "assets"]) await mkdir(path.join(root, dir));
  await writeFile(path.join(root, "js/main.js"), "console.log('public');");
  return root;
}

test("only public files are emitted; stale output and nested private files are removed", async (t) => {
  const root = await fixture(t);
  for (const dir of [".git", "dist", "assets/.private"]) await mkdir(path.join(root, dir), { recursive: true });
  for (const file of [".env", ".git/HEAD", "dist/.env", "js/main.js.map", "assets/.env", "assets/.private/leak.jpg", "package.json"]) {
    await writeFile(path.join(root, file), "private");
  }
  await writeFile(path.join(root, "assets/public.png"), "public image");
  assert.equal(await buildSite(root), 6);
  assert.deepEqual((await readdir(path.join(root, "dist"))).sort(), ["404.html", "assets", "index.html", "intel.html", "js", "trial.html"]);
  assert.deepEqual(await readdir(path.join(root, "dist/assets")), ["public.png"]);
  assert.deepEqual(await readdir(path.join(root, "dist/js")), ["main.js"]);
  assert.equal(await readFile(path.join(root, "dist/js/main.js"), "utf8"), "console.log('public');");
});

const serviceJwt = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.signature`;
for (const [kind, value] of [
  ["Stripe live secret", "sk_live_" + "x".repeat(24)],
  ["AI secret", "sk-" + "x".repeat(32)],
  ["Supabase secret", "sb_secret_" + "x".repeat(24)],
  ["service role marker", "service_role"],
  ["legacy service JWT", serviceJwt],
  ["private key", "-----BEGIN PRIVATE KEY-----"],
]) {
  test(`rejects ${kind} without printing its value or leaving deployable output`, async (t) => {
    const root = await fixture(t);
    await writeFile(path.join(root, "js/main.js"), `const key = '${value}';`);
    await assert.rejects(buildSite(root), (error) => {
      assert.match(error.message, /Potential secret in js[/\\]main.js/);
      assert.ok(!error.message.includes(value));
      return true;
    });
    await assert.rejects(readdir(path.join(root, "dist")), { code: "ENOENT" });
  });
}

test("public publishable and anon keys remain allowed", async (t) => {
  const root = await fixture(t);
  const anonJwt = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from('{"role":"anon"}').toString("base64url")}.signature`;
  await writeFile(path.join(root, "js/main.js"), `const keys = ['pk_live_public', 'sb_publishable_public', '${anonJwt}'];`);
  assert.equal(await buildSite(root), 5);
});

test("rejects both external and embedded source maps", async (t) => {
  const root = await fixture(t);
  for (const reference of ["main.js.map", "data:application/json;base64,e30="]) {
    await writeFile(path.join(root, "js/main.js"), `//# sourceMappingURL=${reference}`);
    await assert.rejects(buildSite(root), /Source map reference/);
  }
});

test("rejects symlink files and directories that could escape the public tree", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, ".env"), "private");
  await symlink(path.join(root, ".env"), path.join(root, "assets/leak.png"));
  await assert.rejects(buildSite(root), /Symbolic link/);
  await rm(path.join(root, "assets/leak.png"));
  await symlink(root, path.join(root, "assets/linked"));
  await assert.rejects(buildSite(root), /Symbolic link/);
});
