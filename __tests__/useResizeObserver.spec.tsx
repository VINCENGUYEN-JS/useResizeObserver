import { expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { useResizeObserver } from "../src";

test("gives an empty list with no animal", async () => {
  const node = document.createElement("div");
  const { result } = renderHook(() => useResizeObserver(node, () => {}));
});
