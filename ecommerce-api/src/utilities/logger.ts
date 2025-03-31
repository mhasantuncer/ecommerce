export const logErrorSimple = (error: unknown) => {
  return error instanceof Error ? error.message : 'Unknown error';
};

export const logError = (error: unknown, context?: string) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(context ? `[${context}] ${message}` : message);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  return message;
};
