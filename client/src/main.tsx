// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

/* ********************************************************************** */

// Import the main app component
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./pages/admin/adminLayout/AdminLayout";
import Barbers from "./pages/admin/barbers/Barbers";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import EventDash from "./pages/admin/eventDash/EventDash";
import ReservationsDash from "./pages/admin/reservations/ReservationsDash";
import ReviewDash from "./pages/admin/reviewDash/ReviewDash";
import Users from "./pages/admin/users/Users";
import Login from "./pages/auth/Login";
import BarberAnnulations from "./pages/barber/barberAnnulations/BarberAnnulations";
import BarberDashBoard from "./pages/barber/barberDashboard/BarberDashBoard";
import BarberDisponibilites from "./pages/barber/barberDisponibilites/BarberDisponibilites";
import BarberLayout from "./pages/barber/barberLayout/BarberLayout";
import BarberParametres from "./pages/barber/barberParametres/BarberParametres";
import BarberPrestation from "./pages/barber/barberPrestations/barbePrestation";
import BarberProfil from "./pages/barber/barberProfil/BarberProfil";
import BarberSignalement from "./pages/barber/barberSignalement/BarberSignalement";
import BarberStatistics from "./pages/barber/barberStatistics/BarberStatistics";
import BarberPlanning from "./pages/barber/Planning/BarberPlanning";
import CustomerAvis from "./pages/customer/avis/CustomerAvis";
import AvisConfirmation from "./pages/customer/avisConfirmation/AvisConfirmation";
import BookingPage from "./pages/customer/booking/BookingPage";
import CustomerLayout from "./pages/customer/customerLayout/CustomerLayout";
import ForgotPassword from "./pages/customer/forgetPassword/ForgotPassword";
import GiveAvis from "./pages/customer/giveAvis/GiveAvis";
import Home from "./pages/customer/home/Home";
import UserProfile from "./pages/customer/profile/UserProfile";
import Reservations from "./pages/customer/reservations/Reservations";
import SearchPage from "./pages/customer/search/SearchPage";

// Import additional components for new routes
// Try creating these components in the "pages" folder
// import About from "./pages/About";
// import Contact from "./pages/Contact";

/* ************************************************************************* */

// Create router configuration with routes
// You can add more routes as you build out your app!
const router = createBrowserRouter([
  {
    element: <App />,
    id: "app",
    children: [
      {
        path: "/",
        element: <CustomerLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "search", element: <SearchPage /> },
          { path: "booking", element: <BookingPage /> },
          { path: "reservations", element: <Reservations /> },
          { path: "profile/:id", element: <UserProfile /> },
          { path: "avis", element: <CustomerAvis /> },
          { path: "give-avis/:appointmentId", element: <GiveAvis /> },
          { path: "avis-confirmation", element: <AvisConfirmation /> },
          { path: "login", element: <Login /> },
          { path: "forgot-password", element: <ForgotPassword /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "users", element: <Users /> },
          { path: "barbers", element: <Barbers /> },
          { path: "reservations", element: <ReservationsDash /> },
          { path: "reviews", element: <ReviewDash /> },
          { path: "events", element: <EventDash /> },
        ],
      },
      {
        path: "/barber",
        element: <BarberLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "profile", element: <BarberProfil /> },
          { path: "prestations", element: <BarberPrestation /> },
          { path: "dashboard", element: <BarberDashBoard /> },
          { path: "planning", element: <BarberPlanning /> },
          { path: "signalement", element: <BarberSignalement /> },
          { path: "statistics", element: <BarberStatistics /> },
          { path: "annulations", element: <BarberAnnulations /> },
          { path: "disponibilites", element: <BarberDisponibilites /> },
          { path: "customer", element: <CustomerAvis /> },
          { path: "parametres", element: <BarberParametres /> },
        ],
      },
    ],
  },
]);

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
