import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stories } from "../js/stories.js";

const approved = {
  "55521581418185184": "2026-10-27T22:49:00+08:00",
  "22258218481521581": "2026-10-27T22:38:44+08:00",
  "22258218242521881": "2026-10-27T12:49:29+08:00",
  "22258218222828541": "2026-10-27T10:28:07+08:00",
  "55521585518514824": "2026-10-29T00:26:42+08:00",
  "14425484284824512": "2026-10-28T20:28:55+08:00",
  "22258212551124441": "2026-10-28T11:40:32+08:00",
  "82258212511484252": "2026-10-28T20:36:01+08:00"
};

test("approved stories retain distinct official sources, publication times and complete guides", () => {
  assert.deepEqual(Object.keys(stories).sort(), Object.keys(approved).sort());
  for (const [id, story] of Object.entries(stories)) {
    assert.equal(story.source, `https://aipoju.com/topic-details/${id}`);
    assert.equal(story.published, approved[id]);
    assert.equal(story.displayTime, story.published.slice(0, 16).replaceAll("-", ".").replace("T", " "));
    assert.ok(story.category.length > 0, `${id} lacks category`);
    for (const field of ["title", "lead", "fact", "boundary"]) {
      assert.ok(story[field].length > 10, `${id} lacks ${field}`);
    }
    assert.equal(story.analysis.length, 2);
    assert.equal(story.steps.length, 3);
  }
});

test("issue 004 links to the four new stories and preserves the previous issue", async () => {
  const intel = await readFile(new URL("../intel.html", import.meta.url), "utf8");
  const latest = intel.match(/<section[^>]+aria-labelledby="latest-title">([\s\S]*?)<\/section>/)[1];
  const links = (html) => [...html.matchAll(/href="story\.html\?id=(\d+)"/g)].map((match) => match[1]);
  assert.deepEqual(links(latest), ["55521585518514824", "14425484284824512", "22258212551124441", "82258212511484252"]);
  assert.deepEqual(links(intel).sort(), Object.keys(approved).sort());
  assert.match(intel, /2026\.10\.29 · 第四期/);
  assert.match(intel, /ARCHIVE \/ 003/);
  const ids = [...intel.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML IDs must remain unique");
  for (const id of links(latest)) {
    assert.ok(latest.includes(stories[id].title));
    assert.ok(latest.includes(stories[id].published));
    assert.match(stories[id].boundary, /待核实/);
  }
  const reader = await readFile(new URL("../story.html", import.meta.url), "utf8");
  assert.match(reader, /INTEL \/ 本站原创解读/);
  assert.match(reader, /href="trial\.html#trial"/);
  assert.match(reader, /id="story-source"/);
});
