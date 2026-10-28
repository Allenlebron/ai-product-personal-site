import test from "node:test";
import assert from "node:assert/strict";
import { stories } from "../js/stories.js";

test("the four approved stories have distinct official sources and complete original guides", () => {
  assert.deepEqual(Object.keys(stories).sort(), [
    "22258218222828541", "22258218242521881", "22258218481521581", "55521581418185184"
  ]);
  for (const [id, story] of Object.entries(stories)) {
    assert.equal(story.source, `https://aipoju.com/topic-details/${id}`);
    assert.match(story.published, /^2026-10-27T\d{2}:\d{2}:\d{2}\+08:00$/);
    assert.ok(story.category.length > 0, `${id} lacks category`);
    for (const field of ["title", "lead", "fact", "boundary"]) {
      assert.ok(story[field].length > 10, `${id} lacks ${field}`);
    }
    assert.equal(story.analysis.length, 2);
    assert.equal(story.steps.length, 3);
  }
});
