export function generateUniqueId(): string {
  if (crypto == null) {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  return crypto.randomUUID();
}

export function generateFingerprint(message: string, stack?: string): string {
  const stackLine = stack?.split('\n')[1]?.trim() || '';
  const cleanedStackLine = stackLine.replace(/:\d+:\d+\)?$/, '');
  return `${message}-${cleanedStackLine}`;
}
