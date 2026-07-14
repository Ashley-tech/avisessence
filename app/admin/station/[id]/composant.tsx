"use client"

import { useState } from "react";
import styles from "../../../app.module.css";
import logo from "../../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import connect from "../../../../public/images/connection.webp"

export default function Composant({stations, users} : any) {
    return(<div>
        <div className={styles.header}>
            <nav className="w-full flex justify-between items-center">
                <ul className={styles.nav_links}>
                </ul>
            </nav>
        </div>
        <div className={styles.section}>
          <div className={styles.content}>
            <Image src={logo} className="cursor-pointer" width={300} height={300} alt="Logo" onClick={() => location.href = "/"}/>
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>
    )
}