import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // importiere den Supabase Client
import styles from '../styles/register.module.scss';

const RegisterForm = () => {
  const [userType, setUserType] = useState<'customer' | 'artist'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [artistName, setArtistName] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prüfen, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      console.error("Passwörter stimmen nicht überein");
      return;
    }

    // Registrierung mit den Benutzerdaten
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      const { user } = data;

      if (error) {
        throw error;
      }

      console.log('Benutzer erfolgreich registriert:', user);

      // Zusätzliche Daten speichern, falls der Benutzer ein Künstler ist
      if (userType === 'artist') {
        const { error: artistError } = await supabase
          .from('artists') // Tabelle für Künstler erstellen
          .insert([
            {
              email,
              artist_name: artistName,
              portfolio_url: portfolioUrl
            }
          ]);

        if (artistError) {
          throw artistError;
        } else {
          console.log('Künstler erfolgreich gespeichert');
        }
      }

      // Optionale Weiterleitung nach erfolgreicher Registrierung
      // window.location.href = '/dashboard'; // Beispiel für Weiterleitung

    } catch (error) {
      if (error instanceof Error) {
        console.error('Fehler bei der Registrierung:', error.message);
      } else {
        console.error('Fehler bei der Registrierung:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2 className={styles.registerTitle}>Registriere dich</h2>

      {/* Auswahl zwischen Künstler und Kunde */}
      <div className={styles.userTypeSelection}>
        <label>
          <input
            type="radio"
            value="customer"
            checked={userType === 'customer'}
            onChange={() => setUserType('customer')}
          />
          Kunde
        </label>
        <label>
          <input
            type="radio"
            value="artist"
            checked={userType === 'artist'}
            onChange={() => setUserType('artist')}
          />
          Künstler
        </label>
      </div>

      {/* Allgemeine Eingabefelder */}
      <div className={styles.formRow}>
        <label htmlFor="email" className={styles.emailTitle}>E-Mail</label>
        <input
          className={styles.emailInput}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formRow}>
        <label htmlFor="password" className={styles.passwordTitle}>Passwort</label>
        <input
          className={styles.passwordInput}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formRow}>
        <label htmlFor="confirmPassword" className={styles.passwordTitle}>Passwort bestätigen</label>
        <input
          className={styles.passwordInput}
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {/* Zusätzliche Felder für Künstler */}
      {userType === 'artist' && (
        <>
          <div className={styles.formRow}>
            <label htmlFor="artistName" className={styles.artistTitle}>Künstlername</label>
            <input
              className={styles.artistInput}
              type="text"
              id="artistName"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="portfolioUrl" className={styles.portfolioTitle}>Portfolio-Website</label>
            <input
              className={styles.portfolioInput}
              type="url"
              id="portfolioUrl"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>
        </>
      )}

      <button type="submit" className={styles.submitButton}>Registrieren</button>
    </form>
  );
};

export default RegisterForm;
