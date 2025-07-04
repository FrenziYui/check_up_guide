export const useStorageFileList = async (
  bucket: string,
  folder: string
): Promise<{
  data: Ref<string[]>;
  error: Ref<string | null>;
}> => {
  const { $axios } = useNuxtApp();
  const data: Ref<string[]> = ref([]);
  const error: Ref<string | null> = ref(null);

  try {
    const res = await $axios.get(`/${bucket}/o`, {
      params: {
        prefix: folder,
        delimiter: "/",
      },
    });

    if (!res.data.items) {
      data.value = [];
    } else {
      data.value = res.data.items
        .filter((item: { name: string }) => item.name !== folder) // カレントフォルダは除外する
        .map((item: { name: string }) => {
          return `https://storage.googleapis.com/${bucket}/${item.name}`;
        });
    }
  } catch (e: any) {
    error.value = e.message || "Storageファイル一覧取得エラー";
  }

  return { data, error };
};
