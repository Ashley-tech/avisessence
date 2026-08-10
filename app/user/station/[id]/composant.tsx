"use client"

import styles from "../../../app.module.css"
import logo from "../../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import { useState } from "react";

export default function Composant({station, users} : any) {
  const [showAddAvis, setShowAddAvis] = useState(false);
  const userName = Cookie.get("user_name");
  var indexCarburant = 0;
  function buttonAddAvis(index: number) {
    if (userName && users[index].type == "Local") {
      return <button className={styles.smallbutton} onClick={() => ouvrirFenetreAddAvis(index)} id={"candidatures-button-"+index}>
        <span className={styles.buttonTitle}>Ajouter un avis</span>
      </button>
    }
    return null;
  }

  function ouvrirFenetreAddAvis(index: number) {
    document.getElementById("message-error")!.textContent = "";
    document.getElementById("note")!.value = "";
    document.getElementById("commentary")!.value = "";
    indexCarburant = index;
    console.log("Index carburant sélectionné :", indexCarburant);
    setShowAddAvis(true);
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
                <th className="text-left">Note* :</th>
                <td className="text-left"><input type="number" id="note" name="note" min={0} max={5} className={styles.input} /></td>
              </tr>
              <tr>
                <th className="text-left">Commentaire :</th>
                <td className="text-left"><textarea id="commentary" name="commentary" className={styles.textarea}></textarea></td>
              </tr>
            </tbody>
          </table>
          <button className={styles.bigbutton} onClick={() => {
            const note = parseFloat((document.getElementById("note") as HTMLInputElement).value);
            const commentary = (document.getElementById("commentary") as HTMLTextAreaElement).value;
            addAvis(indexCarburant, note, commentary);
          }} id="candidatures-button">
            <span className={styles.buttonTitle}>Ajouter</span>
          </button>
          <p id="message-error" className={styles.errorMessage}></p>
        </div>
      </div>
    );
  }

  async function addAvis(indexCarburant: number, note: number, commentary: string) {
    if (Number.isNaN(note) || note < 0 || note > 5) {
      document.getElementById("message-error")!.textContent = "La note doit être renseignée et doit être comprise entre 0 et 5.";
      return;
    }
    const response = await fetch(`/api/stations/${station._id}/${indexCarburant}`, {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note: note,
        commentary: commentary
      })
    });
    const result = await response.json();
    if (!result.success) {
      document.getElementById("message-error")!.textContent = result.raison || "Erreur lors de l'ajout de l'avis.";
      return;
    }

    window.location.reload();
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
                    <th className="text-left">Département :</th>
                    <td className="text-left">{station.localisation.department}</td>
                  </tr>
                  <tr>
                    <th className="text-left">Région :</th>
                    <td className="text-left">{station.localisation.region}</td>
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
                    <th colSpan={2}>Derniers avis</th>
                  </tr>
                </thead>
                <tbody>
                  {station.carburants.map((carburant: any, index: number) => {
                    const lastAvis = carburant.avis?.length ? carburant.avis[carburant.avis.length - 1] : null;

                    return (
                      <tr key={index}>
                        <td>{carburant.name}</td>
                        <td>{carburant.price != 0 ? carburant.price.toFixed(2) + "€/litre" : "RUPTURE"}</td>
                        <td>
                          {lastAvis
                            ? `${lastAvis.commentary} (${lastAvis.noteSur5}/5)`
                            : "Aucun avis disponible"}
                        </td>
                        <td>{buttonAddAvis(index)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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