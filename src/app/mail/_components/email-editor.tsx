import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import Editormenu from "./editor-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import MailSelect from "./mail-select";
import { Input } from "@/components/ui/input";

type Props = {
  subject: string;
  setSubject: (value: string) => void;

  tovalues: { label: string; value: string }[];
  setToValues: (value: { label: string; value: string }[]) => void;

  ccValues: { label: string; value: string }[];
  setCcValues: (value: { label: string; value: string }[]) => void;

  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;
  defaultToolbarExpand?: boolean;
};

const EmailEditor = ({
  subject,
  setCcValues,
  setSubject,
  setToValues,
  tovalues,
  ccValues,
  to,
  handleSend,
  isSending,
  defaultToolbarExpand,
}: Props) => {
  const [value, setValue] = React.useState<string>("");
  const [expanded, setExpanded] = React.useState<boolean>(
    defaultToolbarExpand!,
  );

  const autoComplete = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Ctrl + J");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, autoComplete],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="z-[999]">
      <div className="flex border-b p-4 py-2">
        <Editormenu editor={editor} />
      </div>
      <div className="space-y-2 p-4 pb-0">
        {expanded && (
          <>
            <MailSelect
              label="To: "
              onChange={setToValues}
              placeholder="Add reciepients"
              value={tovalues}
            />
            <MailSelect
              label="Cc: "
              onChange={setCcValues}
              placeholder="Add reciepients"
              value={ccValues}
            />
            <Input
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}
        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-medium text-green-600">Draft: </span>
            <span>to {to.join(", ")}</span>
          </div>
        </div>
      </div>
      <div className="prose w-full px-4">
        <EditorContent editor={editor} value={value} />
      </div>
      <Separator />
      <div className="flex items-center justify-between px-4 py-3">
        <span className={`text-sm`}>
          Tip: Press{" "}
          <kbd className="rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1.5 text-xs font-semibold text-zinc-800">
            Ctrl + J
          </kbd>{" "}
          For AI Autocomplete
        </span>
        <Button
          onClick={async () => {
            editor?.commands?.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
