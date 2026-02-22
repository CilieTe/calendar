import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import CalendarView from "@/components/CalendarView"

export default async function Home() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <CalendarView user={session.user} />
    </main>
  )
}
