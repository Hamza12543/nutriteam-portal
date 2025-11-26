import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, category, languages, specialties } = body || {};

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId required (temp while auth not wired)" }, { status: 400 });
    }

    const data: any = {};
    if (name !== undefined) data.name = (typeof name === 'string' ? name.trim() : null);
    if (category !== undefined) data.category = (typeof category === 'string' && category.trim() ? category.trim() : 'doctor');
    if (languages !== undefined) data.languages = (typeof languages === 'string' ? languages.trim() : null);
    if (specialties !== undefined) data.specialties = (typeof specialties === 'string' ? specialties.trim() : null);

    const existing = await prisma.professionalProfile.findUnique({ where: { userId } });
    if (existing) {
      await prisma.professionalProfile.update({ where: { userId }, data });
    } else {
      await prisma.professionalProfile.create({ data: { userId, category: data.category || 'doctor', ...data } });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
