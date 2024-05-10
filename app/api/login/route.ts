import prisma from "@/prisma";
import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 422 }
      );
    }

    await connectToDb();

    const exeistingUser = await prisma.user.findFirst({ where: { email } });
    if (!exeistingUser) {
      return NextResponse.json(
        { message: "User not registered" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      exeistingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
