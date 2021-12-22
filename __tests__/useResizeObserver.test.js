import { renderHook } from "@testing-library/react-hooks";
import { useResizeObserver } from "../src";

let createNode = jest.fn((node) => ({
  target: node,
  contentRect: { width: 300 },
}));

let onChange;
let reset;

ResizeObserver.mockImplementation(
  jest.fn((impl) => {
    const map = new Map();

    onChange = () => {
      impl([...map.values()]);
    };

    reset = () => map.clear();

    return {
      observe: jest.fn((node) => {
        map.set(node, createNode(node));
        onChange();
      }),
      disconnect: jest.fn(map.clear),
      unobserve: jest.fn((node) => map.delete(node)),
    };
  })
);

let setSize = 0;

const callBack = (entry) => {
  const nodeWidth = entry.borderBoxSize?.inlineSize ?? entry.contentRect.width;
  setSize = nodeWidth;
};

test("return width value when element is resized", async () => {
  const node = document.createElement("div");
  renderHook(() => useResizeObserver(node, callBack));
  expect(setSize).toBe(300);
});
