"use client";
import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

type Props = {};

const LinkAccountButton = async (props: Props) => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Google");
        window.location.href = authUrl;
      }}
    >
      Link Account
    </Button>
  );
};

export default LinkAccountButton;
