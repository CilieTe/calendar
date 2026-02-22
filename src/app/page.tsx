"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import LiteraryView from "@/components/LiteraryView"
import CalendarView from "@/components/CalendarView"
import { getEntryForDate } from "@/data/literaryData"

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  isTodo: boolean
  completed: boolean
  createdAt: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  // Check auth
  if (status === "unauthenticated") {
    redirect("/login")
  }

  const dateStr = currentDate.toISOString().split("T")[0]
  const dateKey = dateStr.substring(5) // MM-DD format
  const literaryEntry = getEntryForDate(currentDate)

  // Fetch events for current date
  useEffect(() => {
    if (status !== "authenticated") return
    fetchEvents()
  }, [currentDate, status])

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/events?date=${dateStr}`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  const handleAddTodo = async (text: string) => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: text,
          date: dateStr,
          isTodo: true,
        }),
      })
      if (res.ok) {
        fetchEvents()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/events?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      fetchEvents()
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" })
      fetchEvents()
    } catch (error) {
      console.error("Failed to delete todo:", error)
    }
  }

  const handleAddMemo = async (text: string) => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: text,
          date: dateStr,
          isTodo: false,
        }),
      })
      if (res.ok) {
        fetchEvents()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMemo = async (id: string) => {
    try {
      await fetch(`/api/events?id=${id}`, { method: "DELETE" })
      fetchEvents()
    } catch (error) {
      console.error("Failed to delete memo:", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1ea]">
        <div className="text-[#8c8578] font-serif-book">加载中...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const user = {
    id: session.user.id as string,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-12 overflow-hidden selection:bg-[#5a4d3f] selection:text-white bg-[#f4f1ea]">
      {/* Main Container - The "Book" */}
      <div className="w-full max-w-[1200px] h-[800px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#e5e0d5]">
        
        {/* Left Side: Literary Gallery */}
        <div className="w-full md:w-1/2 h-full border-r border-[#e5e0d5]">
          <LiteraryView entry={literaryEntry} dateKey={dateKey} />
        </div>

        {/* Right Side: Calendar Tools */}
        <div className="w-full md:w-1/2 h-full">
          <CalendarView 
            user={user}
            date={currentDate}
            events={events}
            onDateChange={setCurrentDate}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onAddMemo={handleAddMemo}
            onDeleteMemo={handleDeleteMemo}
          />
        </div>
      </div>
    </div>
  )
}
