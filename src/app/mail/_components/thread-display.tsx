import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import useThreads from "@/hooks/use-threads";
import { format } from "date-fns";
import {
  Archive,
  ArchiveXIcon,
  Clock1,
  MoreVertical,
  Trash2,
} from "lucide-react";
import React from "react";
import ReplyBox from "./reply-box";
import EmailDisplay from "./email-display";

type Props = {};

const ThreadDisplay = (props: Props) => {
  const { threadId, threads } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <Archive className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <ArchiveXIcon className="size-4" />
          </Button>
          <Button variant={"ghost"} size={"icon"} disabled={!thread}>
            <Trash2 className="size-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant={"ghost"} size={"icon"} disabled={!thread}>
          <Clock1 className="size-4" />
        </Button>
        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"ghost"} size={"icon"} disabled={!thread}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Delete Thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />

      {thread ? (
        <div className="flex flex-1 flex-col overflow-scroll">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={"lol"} />
                <AvatarFallback>
                  {thread?.emails[0]?.from?.name
                    ?.split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">
                  {thread.emails[0]?.from?.name}
                </div>
                <div className="line-clamp-1 text-xs">
                  {thread.emails[0]?.subject}
                </div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {thread.emails[0]?.from?.address}
                </div>
              </div>
            </div>
            {thread.emails[0]?.sentAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(thread.emails[0].sentAt), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex max-h-[calc(100vh-150px)] flex-col overflow-scroll">
            <div className="flex flex-col gap-4 p-6">
              {thread.emails.map((email) => {
                return <EmailDisplay key={email.id} email={email} />;
              })}
            </div>
          </div>
          <div className="flex-1"></div>
          <Separator className="mt-auto" />
          <ReplyBox />
        </div>
      ) : (
        <>
          <div className="p-8 text-center text-muted-foreground">
            No message selected {threadId}
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadDisplay;
