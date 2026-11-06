"use client";

/**
 * Formulaire de connexion à l'admin (courriel + mot de passe).
 */
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { useForm } from "@/hooks/useForm";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { loginSchema } from "@/lib/validation/admin";

export function LoginForm() {
  const router = useRouter();
  const form = useForm({ email: "", password: "" }, loginSchema);
  const { login, isLoading, error } = useAdminAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    const check = form.validate();
    if (!check.success) return;

    const isLoggedIn = await login(check.data);
    if (isLoggedIn) {
      router.replace("/admin");
      router.refresh(); // recharge les données serveur avec la nouvelle session
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Courriel" htmlFor="email" error={form.errors.email} required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={form.values.email}
          onChange={form.handleChange}
          invalid={Boolean(form.errors.email)}
        />
      </Field>
      <Field label="Mot de passe" htmlFor="password" error={form.errors.password} required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.values.password}
          onChange={form.handleChange}
          invalid={Boolean(form.errors.password)}
        />
      </Field>

      {error && <Alert tone="error">{error}</Alert>}

      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
        {isLoading ? <Spinner label="Connexion en cours" /> : <LogIn aria-hidden="true" />}
        Se connecter
      </Button>
    </form>
  );
}
