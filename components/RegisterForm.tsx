import { useState } from "react";
import { registerUser } from "@/services/authServices";
import styles from '@/styles/components/register.module.scss'

const RegisterForm = () => {
  // States to hold form data
  const [email, setEmail] = useState("");  // Email input state
  const [password, setPassword] = useState("");  // Password input state
  const [confirmPassword, setConfirmPassword] = useState("");  // Confirm password input state
  const [name, setName] = useState("");  // Name input state
  const [userType, setUserType] = useState<"customer" | "artist">("customer");  // User type state (customer or artist)
  const [artistName, setArtistName] = useState("");  // Artist name input state (for artist type users)
  const [portfolioUrl, setPortfolioUrl] = useState("");  // Portfolio URL input state (for artist type users)
  const [error, setError] = useState<string | null>(null);  // State for holding error messages
  const [success, setSuccess] = useState<string | null>(null);  // State for holding success messages

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the default form submission behavior
    setError(null);  // Reset error state
    setSuccess(null);  // Reset success state

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");  // Set error if passwords do not match
      return;
    }

    // Format the portfolio URL if the user is an artist and URL is provided
    let formattedPortfolioUrl = portfolioUrl.trim();
    if (userType === "artist" && formattedPortfolioUrl && !/^https?:\/\//i.test(formattedPortfolioUrl)) {
      formattedPortfolioUrl = `https://${formattedPortfolioUrl}`;  // Add 'https://' if missing
    }

    try {
      // Call the registerUser function from authServices to register the user
      const { error } = await registerUser(
        email,  // User email
        password,  // User password
        name,  // User name
        userType,  // User type (customer or artist)
        userType === "artist" ? artistName : undefined,  // Artist name if the user is an artist
        userType === "artist" ? formattedPortfolioUrl : undefined  // Portfolio URL if the user is an artist
      );

      if (error) {
        throw new Error(error);  // If there is an error, throw it
      }

      // Set success message if registration is successful
      setSuccess("Registrierung erfolgreich!");
      // Clear the form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setArtistName("");
      setPortfolioUrl("");
    } catch (error) {
      // Set error message if something goes wrong
      setError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <div>
      <h2 className={styles.registerTitle}>Registrieren</h2>

      {/* Show error message if exists */}
      {error && <p>{error}</p>}
      {/* Show success message if registration is successful */}
      {success && <p className={styles.succes}>{success}</p>}

      <form onSubmit={handleSubmit}>

        {/* User type selection (Customer or Artist) */}
        <div className={styles.userTypeSelection}>
          <label>
            <input
              type="radio"
              value="customer"
              checked={userType === 'customer'}
              onChange={() => setUserType('customer')}  // Change user type to 'customer' on selection
            />
            Kunde
          </label>
          <label>
            <input
              type="radio"
              value="artist"
              checked={userType === 'artist'}
              onChange={() => setUserType('artist')}  // Change user type to 'artist' on selection
            />
            Künstler
          </label>
        </div>
        
        {/* Name input field */}
        <div className={styles.formRow}>
          <label className={styles.title}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}  // Update the name state on input change
              required
              className={styles.input}
            />
          </label>
        </div>

        {/* Email input field */}
        <div className={styles.formRow}>
          <label className={styles.title}>
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update the email state on input change
              required
              className={styles.input}
            />
          </label>
        </div>

        {/* Password input field */}
        <div className={styles.formRow}>
          <label className={styles.title}>
            Passwort
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Update the password state on input change
              required
              className={styles.input}
            />
          </label>
        </div>

        {/* Confirm password input field */}
        <div className={styles.formRow}>
          <label className={styles.title}>
            Passwort bestätigen
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}  // Update the confirmPassword state on input change
              required
              className={styles.input}
            />
          </label>
        </div>

        {/* Additional fields for artists */}
        {userType === "artist" && (
          <>
            {/* Artist name input field (only for artist type users) */}
            <div className={styles.formRow}>
              <label className={styles.title}>
                Künstlername
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}  // Update the artistName state on input change
                  required={userType === "artist"}
                  className={styles.input}
                />
              </label>
            </div>

            {/* Portfolio URL input field (only for artist type users) */}
            <div className={styles.formRow}>
              <label className={styles.title}>
                Portfolio-URL
                <div>
                  <span>https://</span>
                  <input
                    type="text"
                    value={portfolioUrl.replace(/^https?:\/\//, "")}  // Remove 'https://' from the URL if already present
                    onChange={(e) => setPortfolioUrl(e.target.value)}  // Update the portfolioUrl state on input change
                    required={userType === "artist"}
                    className={styles.input}
                  />
                </div>
              </label>
            </div>
          </>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className={styles.submitButton}
        >
          Registrieren
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
