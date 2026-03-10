import React, { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

export const TypingEffect = ({
  text,
  className = "",
  speed = 0.04,
  delay = 0,
  onComplete,
  showCursor = false
}: TypingEffectProps) => {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = React.useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let isCancelled = false;
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    // We parse text into an array to properly handle unicode characters like emojis
    const chars = Array.from(text);

    setDisplayedCount(0);
    setIsTyping(false);

    timeout = setTimeout(() => {
      if (isCancelled) return;
      setIsTyping(true);

      let current = 0;
      interval = setInterval(() => {
        if (isCancelled) return;
        current++;
        setDisplayedCount(current);

        if (current >= chars.length) {
          clearInterval(interval);
          setIsTyping(false);
          if (onCompleteRef.current) onCompleteRef.current();
        }
      }, speed * 1000);

    }, delay * 1000);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, delay]);

  const chars = Array.from(text);

  // We map the full string, turning characters invisible if they haven't been "typed" yet.
  // This guarantees the component never resizes, and text-aligns perfectly even on centered lines.
  let globalCharIndex = 0;

  const tokens = text.split(/(\s+)/);

  // Use a zero-width wrapper for the cursor so it doesn't push characters and cause layout jitter
  const Cursor = () => (
    <span className="relative inline-block w-0 h-[1em] align-text-bottom">      
      <span className="absolute bottom-0 left-[1px] w-[3px] h-full bg-primary opacity-80 animate-[pulse_1s_infinite]" />
    </span>
  );

  return (
    <span className={className}>
      {tokens.map((token, wordIndex) => {
        if (/\s/.test(token)) {
          return (
            <React.Fragment key={wordIndex}>
              {Array.from(token).map((char, charIndex) => {
                const currentIndex = globalCharIndex++;
                const isVisible = currentIndex < displayedCount;
                const injectCursorHere = showCursor && isTyping && currentIndex === displayedCount;

                if (char === "\n") {
                  return (
                    <React.Fragment key={charIndex}>
                      {injectCursorHere && <Cursor />}
                      <br />
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={charIndex}>
                    {injectCursorHere && <Cursor />}
                    <span className={`${isVisible ? "" : "invisible"} ${/(vip|вип)/i.test(token) ? "text-[hsl(265,60%,55%)] font-bold" : ""}`}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        }

        const isVipWord = /(vip|вип)/i.test(token);

        return (
          <span key={wordIndex} className={`inline-block ${isVipWord ? "text-[hsl(265,60%,55%)] font-extrabold text-[1.15em] tracking-wide" : ""}`}>
            {Array.from(token).map((char, charIndex) => {
              const currentIndex = globalCharIndex++;
              const isVisible = currentIndex < displayedCount;
              const injectCursorHere = showCursor && isTyping && currentIndex === displayedCount;

              return (
                <React.Fragment key={charIndex}>
                  {injectCursorHere && <Cursor />}
                  <span className={isVisible ? "" : "invisible"}>
                    {char}
                  </span>
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
      {/* Blinking caret cursor inserted right after the last character if we reached the end */}
      {showCursor && isTyping && displayedCount === chars.length && <Cursor />} 
    </span>
  );
};
