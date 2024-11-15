import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { PrivateHeader } from "@/components/ui/PrivateHeader";
import { PublicHeader } from "@/components/ui/PublicHeader";
import pb from "@/lib/pb";

export const Route = createRootRouteWithContext()({
  component: RootPage,
});

function RootPage() {
  const status = useRouterState({ select: (s) => s.status });

  // Immediately determine if the header should be shown
  const currentPath = window?.location.pathname;
  const isAuthPage =
    currentPath.includes("/cadastro") || currentPath.includes("/login");
  const showHeader = !isAuthPage;

  return (
    <div>
      <LoadingBar isLoading={status === "pending"} delay={300} />

      {/* Conditionally render the header based on showHeader */}
      {showHeader &&
        (pb.authStore.isAuthRecord ? <PrivateHeader /> : <PublicHeader />)}

      <Outlet />
      <Toaster />

      {window.location.hostname !== "conectepubli.com" && (
        <TanStackRouterDevtools />
      )}
    </div>
  );
}

function LoadingBar({
  isLoading,
  delay,
}: {
  isLoading: boolean;
  delay: number;
}) {
  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const delayTimerId = useRef<NodeJS.Timeout>();
  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isLoading) {
      delayTimerId.current = setTimeout(() => {
        if (isLoading) {
          setShowBar(true);
          setProgress(10);

          intervalId.current = setInterval(() => {
            setProgress((prev) => {
              if (prev < 90) return prev + 1;
              return prev;
            });
          }, 100);
        }
      }, delay);
    } else {
      clearTimeout(delayTimerId.current);
      clearInterval(intervalId.current);
      if (showBar) {
        setProgress(100);
        setTimeout(() => setShowBar(false), 300);
      }
    }

    return () => {
      clearTimeout(delayTimerId.current);
      clearInterval(intervalId.current);
    };
  }, [isLoading, delay, showBar]);

  return (
    <>
      {showBar && (
        <div
          className="z-100 absolute left-0 top-0 h-1 bg-[##E34105] transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      )}
    </>
  );
}
