export const useCommon = () => {
  const setDataField = <T extends object>(data: T | undefined, key: keyof T, defaultValue: string): string => {
    if (data && key in data) {
      const value = data[key];
      return typeof value === "string" ? value : defaultValue;
    }
    return defaultValue;
  };
  // 日付をyyyymmddの形に
  const formatDateToString = (date: Date): string => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるので +1
    const day = localDate.getDate().toString().padStart(2, "0"); // 日付のゼロ埋め
    return `${year}${month}${day}`;
  };

  const formatDateToJapanese = (yyyymmdd: string): string => {
    if (!/^\d{8}$/.test(yyyymmdd)) return "";

    const year = yyyymmdd.substring(0, 4);
    const month = parseInt(yyyymmdd.substring(4, 6), 10);
    const day = parseInt(yyyymmdd.substring(6, 8), 10);

    return `${year}年${month}月${day}日`;
  };

  const getGenderLabel = (code: string | number): string => {
    if (code === "1" || code === 1) return "男性";
    if (code === "2" || code === 2) return "女性";
    return "不明";
  };

  // エラーメッセージに追加情報を付加する
  const getErrorMessage = (message: string, details: string = ""): string => {
    return message.replace("{{DETAILS}}", details ? `(${details})` : "");
  };

  const DateToString = (date: Date): string => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるので +1
    const day = localDate.getDate().toString().padStart(2, "0"); // 日付のゼロ埋め
    return `${year}${month}${day}`;
  };
  const stringToDate = (dateStr: string): Date | null => {
    if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);

      const date = new Date(year, month, day);
      // 日付が無効でないことを確認
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } else {
      return null;
    }
  };

  const getDocId = (code: string | number): string => {
    if (code === "1" || code === 1) return "男性";
    if (code === "2" || code === 2) return "女性";
    return "不明";
  };

  return {
    setDataField,
    formatDateToString,
    formatDateToJapanese,
    getGenderLabel,
    getErrorMessage,
  };
};
