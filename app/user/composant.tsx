"use client"

import styles from "../app.module.css";
import logo from "../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";

export default function Composant({data} : any) {
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
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>
  );
}