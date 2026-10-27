import { useAppSelector } from "../hooks/useAppDispatch";

function Profile() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section>
      <h1 className="text-2xl font-bold text-stone-800 mb-4">My profile</h1>
      <p className="text-stone-600">Name: {user?.name}</p>
      <p className="text-stone-600">Email: {user?.email}</p>
      <p className="text-stone-600 capitalize">Account type: {user?.role}</p>
    </section>
  );
}

export default Profile;