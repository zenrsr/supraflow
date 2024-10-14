import React, { useEffect, useState } from "react";
import EmailEditor from "./email-editor";
import { api, RouterOutputs } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";

type Props = {};

const ReplyBox = (props: Props) => {
  const { threadId, accountId } = useThreads();
  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    threadId: threadId ?? "",
    accountId: accountId,
  });

  if (!replyDetails) return null;

  return <Tenjiken replyDetails={replyDetails} />;
};

const Tenjiken = ({
  replyDetails,
}: {
  replyDetails: RouterOutputs["account"]["getReplyDetails"];
}) => {
  const { threadId, accountId } = useThreads();

  const [subject, setSubject] = useState(
    replyDetails.subject.startsWith("Re:")
      ? replyDetails.subject
      : `Re: ${replyDetails.subject}`,
  );
  const [tovalues, setToValues] = useState<{ label: string; value: string }[]>(
    replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
  );

  useEffect(() => {
    if (!threadId || !replyDetails) return;

    if (!replyDetails.subject.startsWith("Re:")) {
      setSubject(`Re:${replyDetails.subject}`);
    } else {
      setSubject(replyDetails.subject);
    }

    setToValues(
      replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
    );
    setCcValues(
      replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
    );
  }, [threadId, replyDetails]);

  const handleSend = async (value: string) => {
    console.log(value);
  };

  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      tovalues={tovalues}
      setToValues={setToValues}
      ccValues={ccValues}
      setCcValues={setCcValues}
      to={replyDetails.to.map((to) => to.address)}
      handleSend={handleSend}
      isSending={false}
    />
  );
};

export default ReplyBox;
