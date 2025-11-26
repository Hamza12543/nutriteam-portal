import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, city, country, lat, lng } = body || {};

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId required (temp while auth not wired)" }, { status: 400 });
    }

    const data: any = {};
    if (typeof city === "string") data.city = city.trim() || null;
    if (typeof country === "string") data.country = country.trim() || null;
    if (lat !== undefined) {
      const n = Number(lat);
      if (Number.isFinite(n)) data.lat = n; else data.lat = null;
    }
    if (lng !== undefined) {
      const n = Number(lng);
      if (Number.isFinite(n)) data.lng = n; else data.lng = null;
    }

    // Upsert the professional profile for this user
    const existing = await prisma.professionalProfile.findUnique({ where: { userId } });
    if (existing) {
      await prisma.professionalProfile.update({ where: { userId }, data });
    } else {
      await prisma.professionalProfile.create({ data: { userId, category: "doctor", ...data } });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
