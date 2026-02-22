"use client"

import { useState, useEffect } from "react"
import { getEntryForDate } from "@/data/literaryData"
import { formatLunarDate } from "@/lib/lunar"
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
}

export default function CalendarView({ user }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [newMemo, setNewMemo] = useState("")
  const [loading, setLoading] = useState(false)

  const literaryEntry = getEntryForDate(selectedDate)
  const lunarText = formatLunarDate(selectedDate)
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  // Get events for selected date
  const selectedDateStr = selectedDate.toISOString().split("T")[0]
  const todos = events.filter(e => e.isTodo && e.date === selectedDateStr)
  const memos = events.filter(e => !e.isTodo && e.date === selectedDateStr)

  useEffect(() => {
    fetchEvents(selectedDateStr)
  }, [selectedDateStr])

  const fetchEvents = async (date: string) => {
    try {
      const res = await fetch(`/api/events?date=${date}`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodo,
          date: selectedDateStr,
          isTodo: true,
        }),
      })
      if (res.ok) {
        setNewTodo("")
        fetchEvents(selectedDateStr)
      }
    } finally {
      setLoading(false)
    }
  }

  const addMemo = async () => {
    if (!newMemo.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMemo,
          date: selectedDateStr,
          isTodo: false,
        }),
      })
      if (res.ok) {
        setNewMemo("")
        fetchEvents(selectedDateStr)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/events?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      fetchEvents(selectedDateStr)
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" })
      fetchEvents(selectedDateStr)
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]
  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">典藏文学日历</h1>
          <p className="text-stone-600">欢迎，{user.name || user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-stone-600 hover:text-stone-800"
        >
          退出登录
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {year}年 {monthNames[month]}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded">←</button>
              <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded">→</button>
            </div>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-stone-500 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const date = new Date(year, month, day)
              const isSelected = date.toDateString() === selectedDate.toDateString()
              const isToday = date.toDateString() === new Date().toDateString()
              const dateStr = date.toISOString().split("T")[0]
              const hasEvents = events.some(e => e.date === dateStr)

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    h-24 p-2 text-left border rounded transition-colors
                    ${isSelected ? "bg-stone-200 border-stone-400" : "hover:bg-stone-50 border-stone-200"}
                    ${isToday ? "ring-2 ring-stone-400" : ""}
                  `}
                >
                  <span className={`text-lg ${isToday ? "font-bold text-stone-800" : "text-stone-700"}`}>
                    {day}
                  </span>
                  {hasEvents && (
                    <div className="mt-1 w-2 h-2 bg-stone-400 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Literary Character */}
          <div className="bg-stone-800 text-stone-100 rounded-lg p-6">
            <div className="text-stone-400 text-sm mb-2">{lunarText}</div>
            <h3 className="text-xl font-bold mb-1">{literaryEntry.name}</h3>
            <p className="text-stone-400 text-sm mb-4">{literaryEntry.source}</p>
            <blockquote className="text-stone-300 italic text-sm leading-relaxed border-l-2 border-stone-600 pl-4">
              "{literaryEntry.quote}"
            </blockquote>
          </div>

          {/* Selected Date Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">
              {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
            </h3>

            {/* Todos */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-stone-600 mb-2">待办事项</h4>
              <div className="space-y-2 mb-3">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="rounded"
                    />
                    <span className={`flex-1 ${todo.completed ? "line-through text-stone-400" : ""}`}>
                      {todo.title}
                    </span>
                    <button
                      onClick={() => deleteEvent(todo.id)}
                      className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  placeholder="添加待办..."
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button
                  onClick={addTodo}
                  disabled={loading}
                  className="px-4 py-2 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Memos */}
            <div>
              <h4 className="text-sm font-medium text-stone-600 mb-2">备忘</h4>
              <div className="space-y-2 mb-3">
                {memos.map(memo => (
                  <div key={memo.id} className="bg-stone-50 p-3 rounded text-sm group relative">
                    {memo.title}
                    <button
                      onClick={() => deleteEvent(memo.id)}
                      className="absolute top-2 right-2 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMemo()}
                  placeholder="添加备忘..."
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button
                  onClick={addMemo}
                  disabled={loading}
                  className="px-4 py-2 bg-stone-600 text-white rounded text-sm hover:bg-stone-500 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
