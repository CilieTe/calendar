export interface LiteraryEntry {
  name: string;
  source: string;
  quote: string;
}

// Key format: "MM-DD"
export const literaryMapping: Record<string, LiteraryEntry> = {
  "02-18": {
    name: "嘉莉",
    source: "《嘉莉妹妹》",
    quote: "她有着青春的活力和一些想象。她的谈情说爱的神秘日子还在后头。她可以思量她喜欢做的事情，喜欢穿的衣服和喜欢去观光的地方。",
  },
  "02-19": {
    name: "蓓姬·夏普",
    source: "《名利场》",
    quote: "克立斯普先生对夏普小姐一见倾心，就因为被她的眼睛从学生座穿过契绥克教堂射向讲经台的那一瞥所击倒。",
  },
  "02-20": {
    name: "玛戈",
    source: "《黑暗中的笑声》",
    quote: "她目不旁视地继续慢慢走路，只是用眼角朝旁边瞟过去，像兔子转动耳朵一样。",
  },
  "02-21": {
    name: "玛格丽特",
    source: "《茶花女》",
    quote: "她的眼神中常常带着一种忧郁的神情，但当她微笑时，她的面容又显得那么天真烂漫。",
  },
  "02-22": {
    name: "司马丽",
    source: "《九级浪》",
    quote: "读书，绘画和治病是这种生活的主要内容。她手不停挥地练习素描，如果晚上不用热毛巾烫手腕，夜里就会痛得睡不着觉。",
  },
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
