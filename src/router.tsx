import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

const router = createRouter({
  routeTree,
  context: {},
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultErrorComponent,
});

export default function App() {
  return <RouterProvider router={router} />;
}