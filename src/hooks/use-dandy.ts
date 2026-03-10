import { useState, useEffect } from "react";

class DandyStateManager {
  private typingCount = 0;
  private listeners: Set<(isTyping: boolean) => void> = new Set();

  startTyping() {
    this.typingCount++;
    this.notify();
  }

  stopTyping() {
    this.typingCount = Math.max(0, this.typingCount - 1);
    this.notify();
  }

  private notify() {
    const isTyping = this.typingCount > 0;
    this.listeners.forEach((l) => l(isTyping));
  }

  subscribe(listener: (isTyping: boolean) => void) {
    this.listeners.add(listener);
    listener(this.typingCount > 0);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const dandyState = new DandyStateManager();

export const useDandyIsTyping = () => {
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => dandyState.subscribe(setIsTyping), []);
  return isTyping;
};
