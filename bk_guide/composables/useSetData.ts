export const setDataField = <T extends object>(
  data: T | undefined,
  key: keyof T,
  defaultValue: string
): string => {
  if (data && key in data) {
    const value = data[key];
    return typeof value === "string" ? value : defaultValue;
  }
  return defaultValue;
};
