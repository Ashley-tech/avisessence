"use client"
import Image from "next/image";
import styles from "../app.module.css";
import logo from "../../public/images/logo.webp";
import { useRouter } from 'next/navigation';
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export default function Home({stations, users} : any) {
  const router = useRouter();
  const userName = Cookie.get("user_name");
  const [showGoodPwd, setShowGoodPwd] = useState(false);
  const index = users.findIndex((user: any) => user.type == "Administrator");

  useEffect(() => {
    if (!showGoodPwd) return;

    const timer = window.setTimeout(() => {
      setShowGoodPwd(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [showGoodPwd]);

  async function connecter() {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
    console.log("usernameInput.value", usernameInput.value);
    console.log("passwordInput.value", passwordInput.value);
    try {
      const response = await fetch('/api/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: usernameInput.value,
          password: passwordInput.value
        })
      });
      const data = await response.json();
      if (data.success) {
        Cookie.set("user_name", usernameInput.value);
        // Connexion réussie, rediriger vers la page d'accueil
        router.push('/admin/menu');
      } else {
        // Afficher le message d'erreur
        if (errorMessage) {
          errorMessage.textContent = data.raison || 'Erreur lors de la connexion. Veuillez réessayer.';
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      if (errorMessage) {
        errorMessage.textContent = 'Erreur lors de la connexion. Veuillez réessayer.';
      }
    }
  }

  return (
    <div>
      <div className={styles.header}>
            <nav>
                <ul className={styles.nav_links}>
                </ul>
            </nav>
        </div>
        <div className={styles.section}>
          <div className={styles.content}>
            <Image src={logo} width={300} height={300} alt="Logo" />
            <h1 className={styles.title}>Connexion en tant qu'administrateur</h1>
            <table className={styles.table}>
              <tbody>
                <tr>
                    <th>Identifiant* :</th>
                    <td><input type="text" id="username" name="username" className={`border border-black ${styles.input}`} /></td>
                </tr>
                <tr>
                    <th>Mot de passe* :</th>
                    <td className="flex items-center gap-2">
                      <input type="password" id="password" name="password" className={`border border-black ${styles.input}`} />
                      <p className={`text-sm cursor-pointer ${styles.smallbutton}`} onClick={() => {
                        const passwordInput = document.getElementById("password") as HTMLInputElement;
                        if (passwordInput) {
                            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
                        }
                      }}>
                        Afficher le mot de passe
                      </p>                   </td>
                </tr>
                <tr>
                    <td colSpan={2}><p className={styles.errorMessage} id="error-message"></p></td>
                </tr>
                <tr>
                    <th colSpan={2}><button className={styles.bigbutton} id="login-button" onClick={() => 
                        setShowGoodPwd(true)
                    }>Afficher vos identifiants administrateurs à saisir</button><br /></th>
                </tr>
                <tr>
                    <th colSpan={2}><button className={styles.bigbutton} id="login-button" onClick={() => 
                        connecter()
                    }>Se connecter</button></th>
                </tr>
              </tbody>
            </table>
            <button className={styles.bigbutton} id="profile-button" onClick={() => location.href = "/"}>
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
          <div id="float_pwd" className={`${styles.float_connection} ${showGoodPwd ? styles.float_connection_visible : ""}`}>
            <div className={styles.popupBox}>
            <h3>Votre login est : {users[index]?.login}</h3>
            <h1>Votre mot de passe est : {users[index]?.password}</h1>
            </div>
            </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>
  );
}
