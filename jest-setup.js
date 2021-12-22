import "regenerator-runtime/runtime";

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  })),
});
