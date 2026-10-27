import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { addToCart, openDrawer } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";

export function useShopActions() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const wishlist = useAppSelector((state) => state.wishlist.products);
  const pendingCartIds = useAppSelector((state) => state.cart.pendingProductIds);

  const requireCustomer = () => {
    if (!user) {
      toast.info("Please log in to continue");
      navigate("/login", { state: { from: location } });
      return false;
    }
    if (user.role !== "customer") {
      toast.info("Shopping is available on customer accounts only");
      return false;
    }
    return true;
  };

  const isSaved = (productId: string) => wishlist.some((product) => product._id === productId);
  const isAdding = (productId: string) => pendingCartIds.includes(productId);

  const addItem = async (productId: string, quantity = 1) => {
    if (!requireCustomer()) return;
    try {
      const result = await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success(result.message);
      dispatch(openDrawer());
    } catch (error) {
      toast.error(error as string);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!requireCustomer()) return;
    const action = isSaved(productId) ? removeFromWishlist : addToWishlist;
    try {
      const result = await dispatch(action(productId)).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return { addItem, toggleWishlist, isSaved, isAdding };
}