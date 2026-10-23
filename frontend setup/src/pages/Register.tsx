import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { registerUser } from "../features/auth/authSlice";
import { isValidEmail, getPasswordError } from "../utils/validators";
import { getDashboardPath } from "../utils/redirects";

type AccountType = "customer" | "seller";
type Errors = { name?: string; email?: string; password?: string; confirmPassword?: string };

function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [role, setRole] = useState<AccountType>("customer");
  const [errors, setErrors] = useState<Errors>({});

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address";
    const passwordError = getPasswordError(form.password);
    if (passwordError) next.password = passwordError;
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await dispatch(
        registerUser({ name: form.name, email: form.email, password: form.password, role })
      ).unwrap();
      toast.success(result.message);
      navigate(getDashboardPath(result.user.role), { replace: true });
    } catch (error) {
      toast.error(error as string);
    }
  };

  const optionClass = (value: AccountType) =>
    `flex-1 text-center py-2.5 rounded-lg border text-sm font-medium cursor-pointer ${
      role === value
        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
        : "border-stone-300 text-stone-600 hover:border-stone-400"
    }`;

  return (
    <section className="max-w-md mx-auto bg-white rounded-xl border border-stone-200 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Create an account</h1>
      <p className="text-stone-600 mb-6">Shop for supplies or start selling</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <fieldset>
          <legend className="block text-sm font-medium text-stone-700 mb-2">I want to</legend>
          <div className="flex gap-3">
            <label className={optionClass("customer")}>
              <input type="radio" name="role" value="customer" className="sr-only"
                checked={role === "customer"} onChange={() => setRole("customer")} />
              Shop
            </label>
            <label className={optionClass("seller")}>
              <input type="radio" name="role" value="seller" className="sr-only"
                checked={role === "seller"} onChange={() => setRole("seller")} />
              Sell
            </label>
          </div>
        </fieldset>

        <Input label="Full name" name="name" autoComplete="name"
          value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" autoComplete="new-password"
          value={form.password} onChange={handleChange} error={errors.password} />
        <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password"
          value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        {role === "seller" && (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
            Seller accounts are reviewed by our team before you can list products.
          </p>
        )}

        <Button type="submit" loading={loading}>Create account</Button>
      </form>

      <p className="text-sm text-stone-600 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-700 font-semibold hover:underline">Log in</Link>
      </p>
    </section>
  );
}

export default Register;