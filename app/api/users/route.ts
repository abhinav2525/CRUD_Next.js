import prisma from "@/prisma";
import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
export const GET = async (req: Request) => {
  try {
    await connectToDb();
    const user = await prisma.user.findMany({
      select: { id: true, name: true, email: true, tweets: true, _count: true },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
