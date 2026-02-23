"use client"

import { useState } from "react"
import { LiteraryEntry } from "@/data/literaryData"

interface LiteraryViewProps {
  entry: LiteraryEntry
  dateKey: string
  term?: string | null
}

export default function LiteraryView({ entry, dateKey, term }: LiteraryViewProps) {
  const [imgFormat, setImgFormat] = useState<'png' | 'jpg' | null>('png')
  
  // 如果有节气，优先显示节气图片；否则显示文学人物图片
  const isJieQiDay = !!term
  const jieQiImagePath = term ? `/assets/jieqi/${term}.png` : null
  const dailyImagePath = imgFormat ? `/assets/daily/${dateKey}.${imgFormat}` : null
  const imagePath = isJieQiDay ? jieQiImagePath : dailyImagePath

  const handleImageError = () => {
    // 节气日：节气图片加载失败，尝试文学人物图片
    if (isJieQiDay) {
      if (imgFormat === 'png') {
        setImgFormat('jpg')
      } else {
        setImgFormat(null)
      }
      return
    }
    // 普通日：文学人物图片格式回退
    if (imgFormat === 'png') {
      setImgFormat('jpg')
    } else {
      setImgFormat(null)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col">
      {/* Background Image */}
      {(imgFormat || isJieQiDay) && (
        <img 
          src={imagePath!} 
          alt={isJieQiDay ? (term || '节气') : entry.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          onError={handleImageError}
        />
      )}
      
      {/* Fallback: 无图片时显示渐变背景+首字母 */}
      {!imgFormat && !isJieQiDay && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4a3f35] to-[#2c2c2c]">
          <span className="text-8xl font-calligraphy text-white/20">{entry.name.charAt(0)}</span>
        </div>
      )}
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Vertical Title Tag (Art Exhibition Style) */}
      <div className="absolute top-12 left-8 writing-vertical text-white/90 z-10 select-none">
        <div className="flex flex-col items-start space-y-4">
          {isJieQiDay ? (
            <>
              <span className="text-3xl font-calligraphy tracking-widest">{term}</span>
              <span className="text-xs font-light tracking-tighter opacity-70 border-l border-white/30 pl-2 ml-1">
                二十四节气
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-calligraphy tracking-widest">{entry.name}</span>
              <span className="text-xs font-light tracking-tighter opacity-70 border-l border-white/30 pl-2 ml-1">
                {entry.source}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Quote Block */}
      <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
        <div className="max-w-md backdrop-blur-md bg-black/20 p-6 border-l-2 border-white/40">
          {isJieQiDay ? (
            <>
              <p className="font-serif-book text-xl text-white leading-relaxed italic">
                「岁时流转，万物有节」
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-white/50"></div>
                <span className="text-xs text-white/60 tracking-widest uppercase">二十四节气</span>
              </div>
            </>
          ) : (
            <>
              <p className="font-serif-book text-xl text-white leading-relaxed italic">
                「{entry.quote}」
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-white/50"></div>
                <span className="text-xs text-white/60 tracking-widest uppercase">From {entry.source}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
