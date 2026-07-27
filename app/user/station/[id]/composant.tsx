"use client"

import styles from "../../../app.module.css"
import logo from "../../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import { useState } from "react";

export default function Composant({station, users} : any) {
  const [showAddAvis, setShowAddAvis] = useState(false);
  const userName = Cookie.get("user_name");
  function buttonAddAvis() {
    if (userName) {
      return <button className={styles.bigbutton} onClick={() => setShowAddAvis(true)} id="candidatures-button">
        <span className={styles.buttonTitle}>Ajouter un avis</span>
      </button>
    }
    return null;
  }

  function fenetreAddAvis() {
    return (
      <div className={`${styles.float_signup} ${showAddAvis ? styles.float_signup_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowAddAvis(false)}>
            ×
          </button>
          <h1 className={styles.title} id="popup-title">
            Ajouter un avis
          </h1>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th className="text-left">Note :</th>
                <td className="text-left"><input type="number" id="note" name="note" min={0} max={5} className={styles.input} /></td>
              </tr>
              <tr>
                <th className="text-left">Commentaire :</th>
                <td className="text-left"><textarea id="commentary" name="commentary" className={styles.textarea}></textarea></td>
              </tr>
            </tbody>
          </table>
          <button className={styles.bigbutton} onClick={() => location.href = `/user/station/${station._id}/addAvis`} id="candidatures-button">
            <span className={styles.buttonTitle}>Ajouter</span>
          </button>
        </div>
      </div>
    );
  }


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
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th className="text-left">Nom :</th>
                    <td className="text-left">{station.name}</td>
                    <th className="text-left">Marque :</th>
                    <td className="text-left">{station.mark}</td>
                  </tr>
                  <tr>
                    <th className="text-left">Adresse :</th>
                    <td className="text-left">{station.localisation.adress}</td>
                    <th className="text-left">Ville :</th>
                    <td className="text-left">{station.localisation.city}</td>
                  </tr>
                  <tr>
                    <th className="text-left">Code postal :</th>
                    <td className="text-left">{station.localisation.postalCode}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
              <h1 className={styles.title}>Carburants disponibles</h1>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Derniers avis</th>
                  </tr>
                </thead>
                <tbody>
                  {station.carburants.map((carburant: any, index: number) => (
                    <tr key={index}>
                      <td>{carburant.name}</td>
                      <td>{carburant.price.toFixed(2)} €</td>
                      <td>{carburant.avis[carburant.avis.length - 1].commentary} ({carburant.avis[carburant.avis.length - 1].note}/5)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {buttonAddAvis()}
            {fenetreAddAvis()}
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