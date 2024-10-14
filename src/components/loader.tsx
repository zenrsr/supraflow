import { Loader } from "lucide-react";
import React from "react";

type Props = {
  size?: number;
};

const Loading = ({ size = 4 }: Props) => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Loader className={`size-${size} animate-spin text-muted-foreground`} />
    </div>
  );
};

export default Loading;
