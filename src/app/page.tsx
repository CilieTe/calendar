import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import CalendarView from "@/components/CalendarView"

export default async function Home() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { user: sessionUser } = session!; 

  const user = {
    id: session.user.id as string,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <CalendarView user={user} />
    </main>
  )
}
