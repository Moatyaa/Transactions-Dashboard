import TransactionsTable from "./Components/TransactionsTable/TransactionsTable";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App() {
  // Initialize QueryClient
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container center flex-column p-4">
        <header className="bg-black w-100 text-white p-3 rounded-1 rounded-bottom-0">
          <h1 className="title mb-0">Customer Transaction Dashboard</h1>
        </header>
        <div className="content w-100 rounded-1 rounded-top-0 justify-content-between">
          <TransactionsTable />
        </div>
      </div>
    </QueryClientProvider>
  );
}
