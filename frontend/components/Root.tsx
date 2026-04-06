import { ReactNode } from "react";

interface RootProps {
  children?: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
