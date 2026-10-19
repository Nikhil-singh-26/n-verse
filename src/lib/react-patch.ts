'use client';

if (typeof window !== 'undefined') {
  // 1. Suppress the benign React 19 / Drei development warnings from triggering the Next.js dev error overlay
  const origConsoleError = console.error;
  console.error = function (...args: unknown[]) {
    if (typeof args[0] === 'string') {
      if (
        args[0].includes('Attempted to synchronously unmount a root while React was already rendering') ||
        args[0].includes('You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before')
      ) {
        return;
      }
    }
    origConsoleError.apply(console, args);
  };

  // 2. Safe DOM removeChild patch to prevent Drei / Fast Refresh NotFoundError crashes
  if (typeof Node !== 'undefined') {
    const origRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child && child.parentNode !== this) {
        return child;
      }
      return origRemoveChild.call(this, child) as T;
    };
  }
}
