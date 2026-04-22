import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { songId, email } = await req.json();

    if (!songId || !email) {
      return NextResponse.json({ error: 'Missing songId or email' }, { status: 400 });
    }

    // Upsert the user so they exist in our DB based on the cookie email
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email }
    });

    // Record the play history
    const history = await prisma.playHistory.create({
      data: {
        userId: user.id,
        songId: parseInt(songId, 10)
      }
    });

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('Failed to log play history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
