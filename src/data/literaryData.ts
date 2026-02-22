export interface LiteraryEntry {
  name: string;
  source: string;
  quote: string;
}

// Key format: "MM-DD"
export const literaryMapping: Record<string, LiteraryEntry> = {
};

export const getEntryForDate = (date: Date): LiteraryEntry => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;
  
  return literaryMapping[key] || {
    name: "未名人物",
    source: "文学长河",
    quote: "在书页的缝隙中，总有一位角色在等待被阅读。",
  };
};
