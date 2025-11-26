import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const category = (searchParams.get('category') || '').trim();
  const city = (searchParams.get('city') || '').trim();
  const country = (searchParams.get('country') || '').trim();

  const where: any = {};
  if (category) where.category = category;
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (country) where.country = { contains: country, mode: 'insensitive' };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
      { specialties: { contains: q, mode: 'insensitive' } },
      { languages: { contains: q, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.professionalProfile.findMany({
    where,
    select: {
      id: true,
      name: true,
      category: true,
      city: true,
      country: true,
      lat: true,
      lng: true,
    },
    take: 100,
  });

  return NextResponse.json({ items });
}
