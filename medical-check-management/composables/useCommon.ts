export const useCommon = () => {
  const formatDatePart = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const formatDateToString = (date: Date): string => {
    return formatDatePart(date);
  };

  const formatDateTimeToString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${formatDatePart(date)}_${hours}${minutes}${seconds}`;
  };
  // エラーメッセージに追加情報を付加する
  const getErrorMessage = (message: string, details: string = ""): string => {
    return message.replace("{{DETAILS}}", details ? `(${details})` : "");
  };

  return {
    formatDateToString,
    formatDateTimeToString,
    getErrorMessage,
  };
};
