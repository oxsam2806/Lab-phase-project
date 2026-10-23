import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { logoutUser } from "../../features/auth/authSlice";
import { openDrawer } from "../../features/cart/cartSlice";
import { getDashboardPath } from "../../utils/redirects";
import SearchBar from "./SearchBar";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors duration-200 ${
    isActive ? "text-emerald-700 font-semibold" : "text-stone-600 hover:text-emerald-700"
  }`;

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const itemCount = useAppSelector((state) => state.cart.cart.itemCount);
  const showShopping = !user || user.role === "customer";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      toast.success(result.message);
      navigate("/");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-stone-200 shadow-sm"
          : "bg-white border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="text-xl font-bold text-emerald-700 shrink-0">
          BeckahDesigns
        </NavLink>

        <SearchBar className="hidden md:flex flex-1 max-w-md" />

        <div className="flex items-center gap-4 sm:gap-5 text-sm shrink-0">
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>

          {user ? (
            <>
              {user.role !== "customer" && (
                <NavLink to={getDashboardPath(user.role)} className={linkClass}>Dashboard</NavLink>
              )}
              <NavLink to="/profile" className={linkClass}>{user.name.split(" ")[0]}</NavLink>
              <button onClick={handleLogout} className="text-stone-600 hover:text-red-600">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <NavLink
                to="/register"
                className="hidden sm:inline-block bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800"
              >
                Sign up
              </NavLink>
            </>
          )}

          {user?.role === "customer" && (
            <NavLink to="/wishlist" aria-label="Wishlist" className={linkClass}>
              <Heart size={22} />
            </NavLink>
          )}

          {showShopping && (
            <button
              onClick={() => dispatch(openDrawer())}
              aria-label={`Open cart, ${itemCount} items`}
              className="relative text-stone-600 hover:text-emerald-700"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1 flex items-center justify-center"></span>
              )}
            </button>
          )}
        </div>
      </nav>
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}

export default Navbar;