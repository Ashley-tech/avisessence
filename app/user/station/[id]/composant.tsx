"use client"

import styles from "../../../app.module.css"
import logo from "../../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";

export default function Composant({stations, users} : any) {
    return(<div>
        <div className={styles.header}>
            <nav>
                <ul className={styles.nav_links}>
                </ul>
            </nav>
        </div>
        <div className={styles.section}>
          <div className={styles.content} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Image src={logo} className="cursor-pointer" width={300} height={300} alt="Logo" onClick={() => location.href = "/"}/>
            <div className={styles.stationsContainer}>
            </div>
            <button className={styles.bigbutton} onClick={() => location.href = "/user"} id="candidatures-button">
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
        </div>
<div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>)
}