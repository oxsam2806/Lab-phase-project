import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch, useAppSelector } from "./hooks/useAppDispatch";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "customer") {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, user?._id, user?.role]);

  return <AppRoutes />;
}

export default App;