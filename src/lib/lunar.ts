// @ts-ignore - lunar-javascript 没有类型声明文件
import { Solar } from "lunar-javascript";

export interface LunarInfo {
  lunarMonth: string
  lunarDay: string
  term: string | null
}

// 自定义月份名称
const customMonthNames = [
  "太簇", "夹钟", "姑洗", "仲吕", "蕤宾", "林钟",
  "夷则", "南吕", "无射", "应钟", "黄钟", "大吕"
];

export const getLunarInfo = (date: Date): LunarInfo => {
  try {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const monthNum = lunar.getMonth();
    const monthIndex = Math.max(0, Math.min(11, Math.abs(monthNum) - 1));
    const monthName = customMonthNames[monthIndex] || "?";

    return {
      lunarMonth: monthName,
      lunarDay: lunar.getDayInChinese(),
      term: lunar.getJieQi() || null,
    };
  } catch (e) {
    console.error("Lunar calculation error:", e);
    return {
      lunarMonth: "?",
      lunarDay: "?",
      term: null,
    };
  }
};

export const formatLunarDate = (date: Date): string => {
  const info = getLunarInfo(date);
  if (info.term) {
    return `${info.lunarMonth}${info.lunarDay} · ${info.term}`;
  }
  return `${info.lunarMonth}${info.lunarDay}`;
};
