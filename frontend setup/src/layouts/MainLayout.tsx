import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import CartDrawer from "../components/cart/CartDrawer";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div key={location.pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>
      <CartDrawer />
    </div>
  );
}

export default MainLayout;