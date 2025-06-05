import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(fileExtension)) {
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "images", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    // Return the public path
    const publicPath = `/images/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      fileName: fileName 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
