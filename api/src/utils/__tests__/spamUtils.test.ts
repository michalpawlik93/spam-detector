import { describe, it } from "node:test";
import { isSpam } from "../spamUtils";
import assert from "node:assert";

describe("isSpam test", () => {
  it("should return a spam match for similar messages with reordered words", () => {
    // Arrange
    const spamMessages = new Map([
      ["aa bb", 1],
      ["cc dd", 1],
    ]);

    //Act
    const result = isSpam("bb aa", spamMessages);

    // Assert
    assert.strictEqual(result, "aa bb");
  });

  it("should not return a match when messages differ significantly in length", () => {
    // Arrange
    const spamMessages = new Map([
      ["aaaaaaaaa", 1],
      ["bbbbbbbb", 1],
    ]);
    //Act
    const result = isSpam("aaaaaaaa", spamMessages);
    // Assert
    assert.strictEqual(result, null);
  });
});
