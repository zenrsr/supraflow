"use client";
import useThreads from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import Avatar from "react-avatar";
import { Letter } from "react-letter";

type Props = {
  email: RouterOutputs["account"]["getThreads"][0]["emails"][0];
};

const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();
  const isMe = account?.emailAddress === email.from.address;

  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-all hover:translate-x-2",
        {
          "border-l-4 border-l-gray-900": isMe,
        },
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          {!isMe && (
            <Avatar
              name={email.from.name ?? email.from.address}
              email={email.from.address}
              size="35"
              textSizeRatio={2}
              round={true}
            />
          )}
          <span className="font-medium">
            {isMe ? "Me" : email.from.address}
          </span>
        </div>
        <div className="text-xm text-muted-foreground">
          {formatDistanceToNow(email.sentAt ?? new Date(), { addSuffix: true })}
        </div>
      </div>
      <div className="h-4" />
      <Letter
        html={email.body ?? ""}
        className="rounded-md bg-white text-black"
      />
    </div>
  );
};

export default EmailDisplay;
