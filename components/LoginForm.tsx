import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../utils/supabaseClient";
import styles from '../styles/login.module.scss';

// LoginResponse Interface zur Typensicherheit
interface LoginResponse {
  user?: { id: string; email?: string; user_type?: string };
  error?: string | null;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Login Funktion
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Verhindert das Neuladen der Seite
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await loginUser(email, password);

      if (response.error) {
        setError("Login fehlgeschlagen: " + response.error);
        setLoading(false);
        return;
      }

      if (response.user) {
        // Navigiere je nach Benutzerrolle
        if (response.user.user_type === 'artist') {
          router.push('/artist-dashboard');
        } else {
          router.push('/shop');
        }
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>

      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formRow}>
          <label className={styles.emailTitle}>E-Mail</label>
          <input
            type="email"
            className={styles.emailInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.passwordTitle}>Passwort</label>
          <input
            type="password"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Lädt..." : "Einloggen"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
