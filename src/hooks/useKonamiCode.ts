import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useKonamiCode() {
  const [isActivated, setIsActivated] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  const reset = useCallback(() => {
    setIsActivated(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...inputSequence, event.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every((key, index) => key === KONAMI_CODE[index]);
        if (isMatch) {
          setIsActivated(true);
          setInputSequence([]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputSequence]);

  return { isActivated, reset };
}
