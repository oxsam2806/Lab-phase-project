import { useAppSelector } from "../../hooks/useAppDispatch";

function SellerDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section>
      <h1 className="text-2xl font-bold text-stone-800 mb-4">Seller dashboard</h1>
      {user?.status === "pending" ? (
        <p className="text-amber-700 bg-amber-50 rounded-lg p-4">
          Your seller account is awaiting approval. You'll be able to add products once it's approved.
        </p>
      ) : (
        <p className="text-stone-600">Your sales overview will appear here.</p>
      )}
    </section>
  );
}

export default SellerDashboard;