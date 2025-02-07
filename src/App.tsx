import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
