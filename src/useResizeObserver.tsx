import { useEffect, useRef } from "react";

type ResizeFnc = (r: ResizeObserverEntry) => void;

let observer: ResizeObserver;

const callBackMap = new Map<Element, React.MutableRefObject<ResizeFnc>[]>();

function init() {
  observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const callbacks = callBackMap.get(entry.target);
      if (callbacks) {
        callbacks.forEach((cb) => cb.current(entry));
      }
    });
  });
}

export function useResizeObserver(
  node: Element | undefined,
  callback: ResizeFnc
) {
  const callbackRef = useRef<ResizeFnc>(() => void 0);

  callbackRef.current = callback;

  useEffect(init, []);

  useEffect(() => {
    /**
     * If there's already an existing node, then add cb to callbackMap
     */
    if (node) {
      const maybeCallbacks = callBackMap.get(node);
      /**
       * Defensive code
       */
      const safeMaybeCallbacks = maybeCallbacks || [];
      const newCallbacks = safeMaybeCallbacks.concat(callbackRef);
      callBackMap.set(node, newCallbacks);
      observer.observe(node);
    }

    return () => {
      if (node) {
        const maybeCallbacks = callBackMap.get(node);
        /**
         * Defensive code
         */
        const safeMaybeCallbacks = maybeCallbacks || [];
        const newCallbacks = safeMaybeCallbacks.filter(
          (cb) => cb !== callbackRef
        );
        callBackMap.set(node, newCallbacks);
        if (newCallbacks.length === 0) {
          observer.unobserve(node);
        }
      }
    };
  });
}
