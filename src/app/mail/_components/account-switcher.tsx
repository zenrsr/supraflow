"use client";
import Loading from "@/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { PlusCircle } from "lucide-react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  isCollapsed: boolean;
};

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  if (!data) return <Loading size={4} />;

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn({ hidden: !isCollapsed })}>
            {data.find((acoount) => acoount.id === accountId)?.emailAddress[0]}
          </span>
          <span className={cn({ hidden: isCollapsed, "ml-2": true })}>
            {data.find((acoount) => acoount.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((account) => {
          return (
            <SelectItem key={account.id} value={account.id}>
              {account.emailAddress}
            </SelectItem>
          );
        })}
        <div
          onClick={async () => {
            const authUrl = await getAurinkoAuthUrl("Google");
            window.location.href = authUrl;
          }}
          className="relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 focus:bg-accent dark:hover:bg-zinc-800"
        >
          <PlusCircle className="mr-1 size-4" />
          Add account
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
