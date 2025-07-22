export const usePassword = async () => {
  const password = useState<string | null>("password", () => null);

  if (password.value !== null) {
    return { password };
  }

  const { data, error: fetchError } = await useFirestoreDocument<{ password: string }>("setting", "pass");

  password.value = fetchError.value ? "14789" : data.value?.password ?? "14789";

  return { password };
};
