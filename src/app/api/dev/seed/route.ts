import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  try {
    // Demo professionals
    const demoPros = [
      { name: "Dr. Anna Müller", email: "anna@example.com", category: "doctor", city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
      { name: "Jean Dupont", email: "jean@example.com", category: "therapist", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
      { name: "Maria Rossi", email: "maria@example.com", category: "nutrition", city: "Milan", country: "Italy", lat: 45.4642, lng: 9.19 },
      { name: "Dr. Emily Clark", email: "emily@example.com", category: "doctor", city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
      { name: "Sofia Novak", email: "sofia@example.com", category: "therapist", city: "Prague", country: "Czechia", lat: 50.0755, lng: 14.4378 },
    ];

    for (const p of demoPros) {
      const user = await prisma.user.upsert({
        where: { email: p.email },
        update: {},
        create: {
          email: p.email,
          password: "demo",
          role: "PROFESSIONAL",
        },
      });

      await prisma.professionalProfile.upsert({
        where: { userId: user.id },
        update: {
          name: p.name,
          category: p.category,
          city: p.city,
          country: p.country,
          lat: p.lat,
          lng: p.lng,
        },
        create: {
          userId: user.id,
          name: p.name,
          category: p.category,
          city: p.city,
          country: p.country,
          lat: p.lat,
          lng: p.lng,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "seed failed" }, { status: 500 });
  }
}
