import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username dan password diperlukan" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Username sudah digunakan" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ message: "Registrasi berhasil", user: { username: user.username } }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Terjadi kesalahan sistem" }, { status: 500 })
  }
}
