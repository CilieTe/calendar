"use client"

import { useState } from "react"
import { getLunarInfo } from "@/lib/lunar"
import { signOut } from "next-auth/react"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  isTodo: boolean
  completed: boolean
  createdAt: string
}

interface CalendarViewProps {
  user: User
  date: Date
  events: Event[]
  onDateChange: (date: Date) => void
  onAddTodo: (text: string) => void
  onToggleTodo: (id: string, completed: boolean) => void
  onDeleteTodo: (id: string) => void
  onAddMemo: (text: string) => void
  onDeleteMemo: (id: string) => void
}

export default function CalendarView({
  user,
  date,
  events,
  onDateChange,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddMemo,
  onDeleteMemo,
}: CalendarViewProps) {
  const [todoInput, setTodoInput] = useState("")
  const [memoInput, setMemoInput] = useState("")
  const [showMemoInput, setShowMemoInput] = useState(false)

  const lunar = getLunarInfo(date)
  const day = date.getDate()
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
  const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

  const dateStr = date.toISOString().split("T")[0]
  const todos = events.filter(e => e.isTodo && e.date === dateStr)
  const memos = events.filter(e => !e.isTodo && e.date === dateStr)

  const handleAddTodo = () => {
    if (!todoInput.trim()) return
    onAddTodo(todoInput)
    setTodoInput("")
  }

  const handleAddMemo = () => {
    if (!memoInput.trim()) return
    onAddMemo(memoInput)
    setMemoInput("")
    setShowMemoInput(false)
  }

  const changeDay = (offset: number) => {
    const nextDate = new Date(date)
    nextDate.setDate(date.getDate() + offset)
    onDateChange(nextDate)
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#fdfaf5]">
      {/* Header with user info */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-[#e5e0d5]">
        <span className="text-sm text-[#8c8578]">欢迎，{user.name || user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-[#8c8578] hover:text-[#5a4d3f] transition-colors"
        >
          退出登录
        </button>
      </div>

      <div className="flex-1 p-12 overflow-hidden flex flex-col">
        {/* Date Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-8xl font-serif-book font-bold text-[#3d3d3d] -ml-1">{day}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium tracking-[0.2em] text-[#a8a295]">{monthNames[date.getMonth()]}</span>
              <div className="h-[1px] w-6 bg-[#d1cfc7]"></div>
              <span className="text-sm text-[#8c8578]">{weekDays[date.getDay()]}</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="bg-[#5a4d3f] text-[#fdfaf5] px-3 py-1 text-xs font-serif-book mb-2 rounded-sm">
              {lunar.lunarMonth}{lunar.lunarDay}
            </div>
            {lunar.term && (
              <span className="text-lg font-calligraphy text-[#8a7a6a]">{lunar.term}</span>
            )}
          </div>
        </div>

        {/* Todo Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <h2 className="text-sm font-bold text-[#5a4d3f] mb-6 tracking-widest uppercase border-b border-[#e5e0d5] pb-2">
            今日事务清单
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {todos.map(todo => (
              <div key={todo.id} className="group flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => onToggleTodo(todo.id, todo.completed)}
                  className="w-4 h-4 rounded-full border-[#d1cfc7] text-[#5a4d3f] focus:ring-[#5a4d3f]"
                />
                <span className={`flex-1 text-[#5a4d3f] font-serif-book text-lg transition-all ${todo.completed ? 'opacity-40 line-through' : ''}`}>
                  {todo.title}
                </span>
                <button 
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-[#d1cfc7] hover:text-red-800 transition-opacity md:opacity-0 md:group-hover:opacity-100 opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <input 
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                placeholder="+ 添加新任务..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-[#a8a295] font-serif-book italic text-lg p-0 placeholder:text-[#d1cfc7]/60"
              />
              <button
                onClick={handleAddTodo}
                className="text-[#5a4d3f] hover:text-[#3d3d3d] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Memo Section */}
        {memos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#e5e0d5]">
            <h3 className="text-xs font-bold text-[#8c8578] mb-3 tracking-widest uppercase">备忘</h3>
            <div className="space-y-2">
              {memos.map(memo => (
                <div key={memo.id} className="group flex items-center justify-between bg-[#f4f1ea] p-3 rounded">
                  <span className="text-sm text-[#5a4d3f] font-serif-book">{memo.title}</span>
                  <button
                    onClick={() => onDeleteMemo(memo.id)}
                    className="text-[#d1cfc7] hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#e5e0d5] flex items-center justify-between">
          {!showMemoInput ? (
            <button 
              onClick={() => setShowMemoInput(true)}
              className="flex items-center gap-2 text-[#8c8578] hover:text-[#5a4d3f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span className="text-sm font-medium">添加备忘</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={memoInput}
                onChange={(e) => setMemoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMemo()}
                placeholder="输入备忘内容..."
                className="flex-1 px-3 py-2 border border-[#e5e0d5] rounded text-sm focus:outline-none focus:border-[#5a4d3f]"
                autoFocus
              />
              <button
                onClick={handleAddMemo}
                className="px-3 py-2 bg-[#5a4d3f] text-white rounded text-sm hover:bg-[#4a3d2f]"
              >
                添加
              </button>
              <button
                onClick={() => setShowMemoInput(false)}
                className="px-3 py-2 text-[#8c8578] hover:text-[#5a4d3f]"
              >
                取消
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => changeDay(-1)}
              className="text-xs font-medium text-[#5a4d3f] uppercase tracking-widest hover:underline"
            >
              ← 前一日
            </button>
            <button 
              onClick={() => onDateChange(new Date())}
              className="text-xs font-medium text-[#5a4d3f] uppercase tracking-widest hover:underline"
            >
              今日
            </button>
            <button 
              onClick={() => changeDay(1)}
              className="text-xs font-medium text-[#5a4d3f] uppercase tracking-widest hover:underline"
            >
              后一日 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
