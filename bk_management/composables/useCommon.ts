export const formatDateToString = (date: Date): string => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = (localDate.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるので +1
  const day = localDate.getDate().toString().padStart(2, "0"); // 日付のゼロ埋め
  return `${year}${month}${day}`;
};
