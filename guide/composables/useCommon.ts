export const useCommon = () => {
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
  const convertDate = (date: string | Date | null, language: string, week: Boolean = false): string => {
    if (date) {
      const dateObj = new Date(date);
      const options: Record<string, Intl.DateTimeFormatOptions> = {
        ja: { year: "numeric", month: "long", day: "numeric" },
        zh: { year: "numeric", month: "long", day: "numeric" },
        en: { year: "numeric", month: "long", day: "numeric" },
      };

      if (week) {
        options[language].weekday = "long";
      }

      return new Intl.DateTimeFormat(language, options[language]).format(dateObj);
    } else {
      return "";
    }
  };

  const convertHonorific = (name: string, language: string): string => {
    switch (language) {
      case "ja":
        return `${name} 様`;
      case "en":
        return `Mr./Ms. ${name}`;
      case "zh":
        return `${name} 先生`;
      default:
        return name;
    }
  };

  return {
    DateToString,
    stringToDate,
    convertDate,
    convertHonorific,
  };
};
