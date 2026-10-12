import { Outlet } from "react-router";

import "./CustomerLayout.css";
import CustomerNavBar from "../../../components/customer/Navbar/CustomerNavBar";
import Footer from "../../../components/footer/Footer";

function CustomerLayout() {
  return (
    <div className="customerLayout-main">
      <Outlet />
      <Footer />
      <CustomerNavBar />
    </div>
  );
}

export default CustomerLayout;
