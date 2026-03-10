const STORAGE_KEY = "dandy_block_completion";

export const getBlockCompletion = (): Record<number, boolean> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const markBlockComplete = (blockId: number) => {
  const current = getBlockCompletion();
  current[blockId] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};
