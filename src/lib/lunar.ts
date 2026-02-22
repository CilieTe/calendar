// @ts-ignore
import { Solar, Lunar } from "lunar-javascript";

export interface LunarInfo {
  lunarMonth: string;
  lunarDay: string;
  ganZhi: string;
  zodiac: string;
  term: string | null;
}

export const getLunarInfo = (date: Date): LunarInfo => {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  
  return {
    lunarMonth: lunar.getMonthInChinese(),
    lunarDay: lunar.getDayInChinese(),
    ganZhi: lunar.getYearInGanZhi(),
    zodiac: lunar.getYearShengXiao(),
    term: solar.getJieQi() || null,
  };
};

export const formatLunarDate = (date: Date): string => {
  const info = getLunarInfo(date);
  if (info.term) {
    return `${info.lunarMonth}月${info.lunarDay} · ${info.term}`;
  }
  return `${info.lunarMonth}月${info.lunarDay}`;
};
