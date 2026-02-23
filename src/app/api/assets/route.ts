import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// GET /api/assets/:path
export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url)
  // 提取文件路径：/api/assets/jieqi/立春.png -> jieqi/立春.png
  const filePath = pathname.replace(/^\/api\/assets\//, "")
  
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 })
  }
  
  try {
    const absolutePath = path.join(process.cwd(), "shared", "assets", filePath)
    const fileBuffer = await readFile(absolutePath)
    
    // 根据文件扩展名设置 Content-Type
    const ext = path.extname(filePath).toLowerCase()
    const contentType = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    }[ext] || "application/octet-stream"
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // 缓存 1 天
      },
    })
  } catch (error) {
    return new NextResponse("Not found", { status: 404 })
  }
}
