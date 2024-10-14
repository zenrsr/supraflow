import ThemeToggle from "@/components/theme-toggle";
import dynamic from "next/dynamic";
import React from "react";
const Mail = dynamic(() => import("./_components/mail"), { ssr: false });

type Props = {};

const MailDashboard = (props: Props) => {
  return (
    <div className="h-screen">
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
      <Mail
        navCollapsedSize={4}
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
      />
    </div>
  );
};

export default MailDashboard;
