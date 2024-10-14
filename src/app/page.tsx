import LinkAccountButton from "@/components/link-account-button";
import React from "react";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LinkAccountButton />
    </div>
  );
};

export default Home;
