export const useConstants = () => {
  const STATUS = {
    EXCLUDED: "0",
    UNINSPECTED: "1",
    INSPECTING: "8",
    INSPECTED: "9",
  } as const;

  return {
    STATUS,
  };
};
