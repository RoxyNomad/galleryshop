import { useState } from "react";
import { loginUser } from "@/services/authServices";
import { LoginResponse } from '@/services/types';
import styles from '@/styles/components/login.module.scss';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store password input
  const [error, setError] = useState<string | null>(null); // State to store any error message
  const [loading, setLoading] = useState(false); // State to track if login request is loading

  // Handle Login function
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents page reload on form submit
    setLoading(true); // Set loading state to true while the login process is happening
    setError(null); // Clear any previous error messages
  
    try {
      // Call the loginUser function from authServices and await its response
      const response: LoginResponse = await loginUser(email, password);
  
      if (response.error) {
        // If login failed, set error message
        setError("Login fehlgeschlagen: " + response.error);
        setLoading(false);
        return;
      }
  
      if (!response.user || !response.user.user_type) {
        // If user or user_type is missing, set error message
        setError("Fehler: Nutzertyp nicht gefunden.");
        setLoading(false);
        return;
      }
  
      // Try to open a new tab based on user type
      let newTab: Window | null = null;
  
      // Conditional check for user type to navigate to different pages
      switch (response.user.user_type) {
        case 'artist':
          newTab = window.open('/artist/artistDashboard', '_blank'); // Opens the artist dashboard in a new tab
          break;
        case 'customer':
          newTab = window.open('/customer/shop', '_blank'); // Opens the customer shop page in a new tab
          break;
        default:
          // If user type is invalid, set error message
          setError("Ungültiger Nutzertyp.");
          setLoading(false);
          return;
      }
  
      // Check if the tab was successfully opened
      if (!newTab) {
        setError("Konnte einen neuen Tab nicht öffnen."); // If tab failed to open, set error message
      }
    } catch {
      // Catch any unexpected errors and set error message
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false); // Set loading state to false when the login process is complete
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>

      {error && <p className={styles.errorText} aria-live="assertive">{error}</p>} {/* Display error message if any */}

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formRow}>
          <label className={styles.emailTitle}>E-Mail</label>
          <input
            type="email"
            className={styles.emailInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            required
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.passwordTitle}>Passwort</label>
          <input
            type="password"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Lädt..." : "Einloggen"} {/* Change button text based on loading state */}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
