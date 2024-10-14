"use client";

import React from "react";
import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  Priority,
} from "kbar";
import Results from "./results";
import { useLocalStorage } from "usehooks-ts";
import useThemeSwitch from "./use-theme-switch";
import toggleAccountSwitch from "./toggle-accounts";

type Props = {
  children: React.ReactNode;
};

const CommandK = ({ children }: Props) => {
  const [_, setTab] = useLocalStorage("supraflow-tab", "inbox");
  const [_done, setDone] = useLocalStorage("supraflow-done", false);

  const actions: Action[] = [
    {
      id: "inboxAction",
      name: "Inbox",
      shortcut: ["g", "i"],
      keywords: "inbox",
      section: "Navigation",
      subtitle: "View your inbox",
      perform: () => {
        setTab("inbox");
      },
    },
    {
      id: "draftsAction",
      name: "Drafts",
      shortcut: ["g", "d"],
      keywords: "drafts",
      priority: Priority.HIGH,
      subtitle: "View your drafts",
      section: "Navigation",
      perform: () => {
        setTab("drafts");
      },
    },
    {
      id: "sentAction",
      name: "Sent",
      shortcut: ["g", "s"],
      keywords: "sent",
      section: "Navigation",
      subtitle: "View the sent",
      perform: () => {
        setTab("sent");
      },
    },
    {
      id: "pendingAction",
      name: "See done",
      shortcut: ["g", "d"],
      keywords: "done",
      section: "Navigation",
      subtitle: "View the done emails",
      perform: () => {
        setDone(true);
      },
    },
    {
      id: "doneAction",
      name: "See Pending",
      shortcut: ["g", "u"],
      keywords: "pending, undone, not done",
      section: "Navigation",
      subtitle: "View the pending emails",
      perform: () => {
        setDone(false);
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <ActualComponent>{children}</ActualComponent>
    </KBarProvider>
  );
};

export default CommandK;

const ActualComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitch();
  toggleAccountSwitch();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[999] bg-black/40 !p-0 backdrop-blur-sm dark:bg-black/60">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-1/2 overflow-hidden rounded-lg border bg-white text-foreground shadow-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-200">
            <div className="bg-white dark:bg-zinc-800">
              <div className="border-x-0 border-b-2 dark:border-zinc-700">
                <KBarSearch className="w-full bg-white px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-zinc-800" />
              </div>
              <Results />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
