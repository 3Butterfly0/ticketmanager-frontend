import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import AllTickets from "./pages/AllTickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{ className: 'font-body text-sm font-medium' }} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AllTickets />} />
          <Route path="create" element={<CreateTicket />} />
          <Route path="ticket/:id" element={<TicketDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
