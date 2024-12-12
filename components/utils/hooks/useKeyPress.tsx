"use client";

import { useEffect } from "react";

type KeyPressHandler = (event: KeyboardEvent) => void;

const useKeyPress = (
  targetKey: string | string[],
  handler: KeyPressHandler
) => {
  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent) => {
      if (
        event.key === targetKey ||
        (Array.isArray(targetKey) && targetKey.includes(event.key))
      ) {
        handler(event);
      }
    };

    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [targetKey, handler]);
};

export default useKeyPress;
