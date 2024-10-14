import { getAurinkoToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect("/");
  console.log({ userId });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json({
      message: "Failed to link account!. please try again",
    });

  const code = params.get("code");
  if (!code)
    return NextResponse.json({
      message:
        "Failed to link account!. No code is found to exchange access token from aurinko",
    });

  const token = await getAurinkoToken(code);
  if (!token)
    return NextResponse.json({
      message: "Failed to exchange code for access token",
    });

  const accountDetails = await getAccountDetails(token.accessToken);

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: userId,
      emailAddress: accountDetails?.email!,
      name: accountDetails?.name!,
      accessToken: token.accessToken,
    },
  });

  // intiate start-sync with aurinko
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((response) => console.log({ response }))
      .catch((error) =>
        console.error("Failed to trigger initial sync with aurinko", error),
      ),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
