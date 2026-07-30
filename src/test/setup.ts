import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function pokazModalnie() {
    this.setAttribute('open', '');
  };
}

if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function zamknij() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

if (typeof HTMLMediaElement !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
}

afterEach(() => {
  if (typeof document !== 'undefined') cleanup();
  if (typeof localStorage !== 'undefined') localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (typeof window !== 'undefined') window.history.replaceState({}, '', '/');
});
