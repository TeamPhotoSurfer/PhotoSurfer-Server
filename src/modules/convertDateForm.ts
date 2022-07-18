import dayjs from "dayjs";

export const convertDateForm = (date: Date): string => {
  const now: string = dayjs(date).format("YYYY-MM-DD");

  return now;
};
