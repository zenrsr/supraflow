import React from "react";
import { cookies } from "next/headers";
import { accounts } from "./data";
import { mails } from "./mail-type";
import Mail from "./mail";

type Props = {};

const MailPage = (props: Props) => {
  const layout = cookies().get("react-resizable-panels:layout:mail");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <Mail
      accounts={accounts}
      mails={mails}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    />
  );
};

export default MailPage;
