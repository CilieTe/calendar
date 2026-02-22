import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// GET /api/events?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 })
  }

  const events = await prisma.event.findMany({
    where: {
      userId: session.user.id,
      date: date,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return NextResponse.json(events)
}

// POST /api/events
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, date, isTodo, isAllDay, startTime, endTime } = body

  if (!title || !date) {
    return NextResponse.json(
      { error: "Title and date are required" },
      { status: 400 }
    )
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      isTodo: isTodo ?? false,
      isAllDay: isAllDay ?? true,
      startTime,
      endTime,
      userId: session.user.id,
    },
  })

  return NextResponse.json(event)
}

// PUT /api/events?id=xxx
export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  const body = await request.json()

  const event = await prisma.event.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: body,
  })

  return NextResponse.json(event)
}

// DELETE /api/events?id=xxx
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  await prisma.event.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}
