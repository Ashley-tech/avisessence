"use client"

import { useState } from "react";
import styles from "../../app.module.css";
import logo from "../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import connect from "../../../public/images/connection.webp"

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
            <div className={styles.stationsContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Marque</th>
                            <th>Adresse</th>
                            <th>Ville</th>
                            <th>Code postal</th>
                            <th>Carburants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.map((station: any) => (
                            <tr key={station._id}>
                                <td>{station.name}</td>
                                <td>{station.mark}</td>
                                <td>{station.localisation.adress}</td>
                                <td>{station.localisation.city}</td>
                                <td>{station.localisation.postalCode}</td>
                                <td>{station.carburants.join(", ")}</td>
                                <td>
                                    <button className={styles.smallbutton} onClick={() => location.href = `/admin/station/${station._id}`}>
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className={styles.bigbutton} onClick={() => location.href = "/"} id="candidatures-button">
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>);
}