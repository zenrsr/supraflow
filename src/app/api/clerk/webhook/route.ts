// https://metabolism-football-bumper-offensive.trycloudflare.com/api/clerk/webhook

import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { data } = await req.json();

  console.log({ data });

  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;
  const id = data.id;

  await db.user.create({
    data: {
      id: id,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
    },
  });

  console.log("User is created");

  return new NextResponse("webhook received", { status: 200 });
};
