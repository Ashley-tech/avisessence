"use client"
import Image from "next/image";
import styles from "./app.module.css";
import logo from "../public/images/logo.webp";
import Cookie from "js-cookie";
import { useRouter } from 'next/navigation';

export default function Composant({users}: any) {
  const router = useRouter();
  const userName = Cookie.get("user_name");
  const user = users.find((user: any) => user.login === userName);

  function handleUserClick() {
    location.href = "/user";
  }

  function handleAdminClick() {
    if (userName && user.type == "Administrator") {
        location.href = "/admin/menu"
    } else {
        location.href = "/admin";
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
            <button className={styles.bigbutton} onClick={handleUserClick} id="candidatures-button">
              <span className={styles.buttonTitle}>Utilisateur</span>
              <span className={styles.buttonSubtitle}>(Consulter les avis, signaler un problème, etc.)</span>
            </button>
            <button className={styles.bigbutton} id="profile-button" onClick={handleAdminClick}>
              <span className={styles.buttonTitle}>Administrateur</span>
              <span className={styles.buttonSubtitle}>(Gérer les stations, ajouter carburants, etc.)</span>
            </button>
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>
  );
}
