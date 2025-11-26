import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, name, category, city, country } = body || {};
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, role },
    });

    if (role === 'PATIENT') {
      await prisma.patientProfile.create({ data: { userId: user.id, name, city, country } });
    } else if (role === 'PROFESSIONAL') {
      await prisma.professionalProfile.create({ data: { userId: user.id, name, category: category || 'doctor', city, country } });
    }

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
