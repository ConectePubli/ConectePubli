import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";
import I18n from "./components/i18n/i18n";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <I18n />
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
