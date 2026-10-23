import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { loginUser } from "../features/auth/authSlice";
import { isValidEmail } from "../utils/validators";
import { getDashboardPath } from "../utils/redirects";

type Errors = { email?: string; password?: string };

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next: Errors = {};
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await dispatch(loginUser(form)).unwrap();
      toast.success(result.message);
      navigate(from || getDashboardPath(result.user.role), { replace: true });
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Welcome back</h1>
      <p className="text-stone-600 mb-6">Log in to your account</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" autoComplete="current-password"
          value={form.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" loading={loading}>Log in</Button>
      </form>

      <p className="text-sm text-stone-600 mt-6 text-center">
        New here?{" "}
        <Link to="/register" className="text-emerald-700 font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default Login;