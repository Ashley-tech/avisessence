"use client"

import { useState } from "react";
import styles from "../../app.module.css";
import logo from "../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import connect from "../../../public/images/connection.webp"

export default function Composant({stations, users} : any) {
    const [showConfirmDeconnection, setShowConfirmDeconnection] = useState(false);
    const [showNewStation, setShowNewStation] = useState(false);
    const [showModifyStation, setShowModifyStation] = useState(false);
    const [selectedStationIndex, setSelectedStationIndex] = useState<number>(-1);
    const [selectedCarburantIndex, setSelectedCarburantIndex] = useState<number>(-1);
    const [showConfirmDeleteStation, setShowConfirmDeleteStation] = useState(false);

    async function addStation() {
        const nomInput = document.getElementById("nom") as HTMLInputElement;
        const marqueInput = document.getElementById("marque") as HTMLInputElement;
        const adresseInput = document.getElementById("adresse") as HTMLInputElement;
        const codePostalInput = document.getElementById("code-postal") as HTMLInputElement;
        const villeInput = document.getElementById("ville") as HTMLInputElement;
        const departementInput = document.getElementById("departement") as HTMLInputElement;
        const regionInput = document.getElementById("region") as HTMLInputElement;

        if (nomInput.value == "" || marqueInput.value == "" || adresseInput.value == "" || codePostalInput.value == "" || villeInput.value == "" || departementInput.value == "" || regionInput.value == "") {
            document.getElementById("error-message")!.textContent = "Veuillez remplir tous les champs obligatoires.";
            return;
        }

        let data: any = { success: false, raison: 'Erreur lors de l\'ajout de la station. Veuillez réessayer.' };

        try {
            const response = await fetch('/api/stations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nomInput.value,
                    mark: marqueInput.value,
                    adress: adresseInput.value,
                    postalCode: codePostalInput.value,
                    city: villeInput.value,
                    department: departementInput.value,
                    region: regionInput.value
                })
            });

            const responseText = await response.text();
            if (responseText) {
                data = JSON.parse(responseText);
            } else {
                data = { success: false, raison: 'Le serveur n\'a renvoyé aucune réponse.' };
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la station:', error);
            data = { success: false, raison: 'Le serveur a renvoyé une réponse invalide.' };
        }

        if (data.success) {
            window.location.reload();
        } else {
            document.getElementById("error-message")!.textContent = data.raison || 'Erreur lors de l\'ajout de la station. Veuillez réessayer.';
        }
    }

    async function deleteStation(indexStation: number) {
        let data: any = { success: false, raison: 'Erreur lors de la suppression de la station. Veuillez réessayer.' };
        try {
          const response = await fetch(`/api/stations/${stations[indexStation]._id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          data = result;
          if (data.success) {
            window.location.reload();
          } else {
            document.getElementById("error-message")!.textContent = data.raison || 'Erreur lors de la suppression de la station. Veuillez réessayer.';
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la station:', error);
        }
      }

    async function updateStation(indexStation: number) {
        const nomInput = document.getElementById("nomm") as HTMLInputElement;
        const marqueInput = document.getElementById("marquem") as HTMLInputElement;
        const adresseInput = document.getElementById("adressem") as HTMLInputElement;
        const codePostalInput = document.getElementById("code-postalm") as HTMLInputElement;
        const villeInput = document.getElementById("villem") as HTMLInputElement;
        const departementInput = document.getElementById("departementm") as HTMLInputElement;
        const regionInput = document.getElementById("regionm") as HTMLInputElement;

        if (nomInput.value == "" || marqueInput.value == "" || adresseInput.value == "" || codePostalInput.value == "" || villeInput.value == "" || departementInput.value == "" || regionInput.value == "") {
            document.getElementById("error-message")!.textContent = "Un champ ne peut pas être vide. Veuillez remplir tous les champs obligatoires.";
            return;
        }

        let data: any = { success: false, raison: 'Erreur lors de la mise à jour de la station. Veuillez réessayer.' };

        try {
            const response = await fetch(`/api/stations/${stations[selectedStationIndex]._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nomInput.value,
                    mark: marqueInput.value,
                    adress: adresseInput.value,
                    postalCode: codePostalInput.value,
                    city: villeInput.value,
                    department: departementInput.value,
                    region: regionInput.value
                })
            });

            const responseText = await response.text();
            if (responseText) {
                data = JSON.parse(responseText);
            } else {
                data = { success: false, raison: 'Le serveur n\'a renvoyé aucune réponse.' };
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la station:', error);
            data = { success: false, raison: 'Le serveur a renvoyé une réponse invalide.' };
        }

        if (data.success) {
            window.location.reload();
        } else {
            document.getElementById("error-message")!.textContent = data.raison || 'Erreur lors de la mise à jour de la station. Veuillez réessayer.';
        }
    }

    function openNewStationPopup() {
        (document.getElementById("nom") as HTMLInputElement).value = "";
        (document.getElementById("marque") as HTMLInputElement).value = "";
        (document.getElementById("adresse") as HTMLInputElement).value = "";
        (document.getElementById("code-postal") as HTMLInputElement).value = "";
        (document.getElementById("ville") as HTMLInputElement).value = "";
        (document.getElementById("departement") as HTMLInputElement).value = "";
        (document.getElementById("region") as HTMLInputElement).value = "";
        document.getElementById("error-message")!.textContent = "";
        setShowNewStation(true);
    }

    function openConfirmDeleteStationPopup(stationIndex: number) {
        setSelectedStationIndex(stationIndex);
        setShowConfirmDeleteStation(true);
        (document.getElementById("delete-station-title") as HTMLHeadingElement).textContent = `Êtes-vous sûr de vouloir supprimer la station "${stations[stationIndex].name}" ?`;
    }

    function openModifyStationPopup(stationIndex: number) {
        setSelectedStationIndex(stationIndex);
        (document.getElementById("nomm") as HTMLInputElement).value = stations[stationIndex].name;
        (document.getElementById("marquem") as HTMLInputElement).value = stations[stationIndex].mark;
        (document.getElementById("adressem") as HTMLInputElement).value = stations[stationIndex].localisation.adress;
        (document.getElementById("code-postalm") as HTMLInputElement).value = stations[stationIndex].localisation.postalCode;
        (document.getElementById("villem") as HTMLInputElement).value = stations[stationIndex].localisation.city;
        (document.getElementById("departementm") as HTMLInputElement).value = stations[stationIndex].localisation.department;
        (document.getElementById("regionm") as HTMLInputElement).value = stations[stationIndex].localisation.region;
        document.getElementById("error-message-2")!.textContent = "";
        (document.getElementById("popup-title-update") as HTMLHeadingElement).textContent = `Modifier les informations de la station "${stations[stationIndex].name}"`;
      setShowModifyStation(true)
    }

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
                            <th>Carburants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stations.map((station: any) => (
                            <tr key={station._id}>
                                <td>{station.name}</td>
                                <td>{station.mark}</td>
                                <td>{station.localisation.adress}, {station.localisation.postalCode}, {station.localisation.city} ({station.localisation.department}, {station.localisation.region})</td>
                                <td>
                                  {station.carburants.map((c: any, index: number) => (
                                    <span key={index}>
                                      {c.name} {c.price === 0 ? "en RUPTURE" : `à ${c.price}€/litre`}
                                      <button className={styles.smallbutton} onClick={() => {
                                        setSelectedStationIndex(stations.findIndex((s: any) => s._id === station._id));
                                        setSelectedCarburantIndex(index);
                                      }}>
                                        Modifier
                                      </button>
                                      {index < station.carburants.length - 1 ? " - " : ""}
                                    </span>
                                  ))}
                                </td>
                                <td>
                                    <button className={styles.smallbutton} onClick={() => openModifyStationPopup(stations.findIndex((s: any) => s._id === station._id))}>
                                        Modifier
                                    </button><br />
                                    <button className={styles.smallbutton}>
                                        Nouveau carburant
                                    </button><br />
                                    <button className={styles.smallbutton} onClick={() => openConfirmDeleteStationPopup(stations.findIndex((s: any) => s._id === station._id))}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className={styles.bigbutton} id="nouvelle-station-button" onClick={openNewStationPopup}>
              <span className={styles.buttonTitle}>Nouvelle station</span>
            </button>
            <button className={styles.bigbutton} id="deconnect-button" onClick={() => setShowConfirmDeconnection(true)}>
              <span className={styles.buttonTitle}>Déconnexion</span>
            </button>
            <button className={styles.bigbutton} onClick={() => location.href = "/"} id="retour-button">
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
          <div id="float_ns" className={`${styles.float_modification_infos} ${showNewStation ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowNewStation(false)}>
            ×
          </button>
          <h3>Ajouter une nouvelle station</h3>
          <table>
            <tbody>
              <tr>
                <td>Nom* :</td>
                <td><input type="text" placeholder="Nom" id="nom" /></td>
              </tr>
              <tr>
                <td>Marque* :</td>
                <td><input type="text" placeholder="Marque" id="marque" /></td>
              </tr>
              <tr>
                <td>Adresse* :</td>
                <td><input type="text" placeholder="Adresse" id="adresse" /></td>
              </tr>
              <tr>
                <td>Code postal* :</td>
                <td><input type="text" placeholder="Code postal" id="code-postal" /></td>
              </tr>
              <tr>
                <td>Ville* :</td>
                <td><input type="text" placeholder="Ville" id="ville" /></td>
              </tr>
              <tr>
                <td>Département* :</td>
                <td><input type="text" placeholder="Département" id="departement" /></td>
              </tr>
              <tr>
                <td>Région* :</td>
                <td><input type="text" placeholder="Région" id="region" /></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={() => addStation()}>
            Ajouter
          </button>
        </div>
      </div>
          <div id="float_modification_infos" className={`${styles.float_modification_infos} ${showModifyStation ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowModifyStation(false)}>
            ×
          </button>
          <h3 id="popup-title-update">Modifier les informations de la station</h3>
          <table>
            <tbody>
              <tr>
                <td>Nom* :</td>
                <td><input type="text" placeholder="Nom" id="nomm" /></td>
              </tr>
              <tr>
                <td>Marque* :</td>
                <td><input type="text" placeholder="Marque" id="marquem" /></td>
              </tr>
              <tr>
                <td>Adresse* :</td>
                <td><input type="text" placeholder="Adresse" id="adressem" /></td>
              </tr>
              <tr>
                <td>Code postal* :</td>
                <td><input type="text" placeholder="Code postal" id="code-postalm" /></td>
              </tr>
              <tr>
                <td>Ville* :</td>
                <td><input type="text" placeholder="Ville" id="villem" /></td>
              </tr>
              <tr>
                <td>Département* :</td>
                <td><input type="text" placeholder="Département" id="departementm" /></td>
              </tr>
              <tr>
                <td>Région* :</td>
                <td><input type="text" placeholder="Région" id="regionm" /></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message-2" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={() => updateStation(selectedStationIndex)}>
            Modifier
          </button>
        </div>
      </div>
          <div id="float_confirm_deconnection" className={`${styles.float_connection} ${showConfirmDeconnection ? styles.float_connection_visible : ""}`}>
            <div className={styles.popupBox}>
            <h3>Êtes-vous sûr de vouloir vous déconnecter ?</h3>
            <button className={styles.popupAction} onClick={() => {
                Cookie.remove("user_name");
                location.href = "/admin";
              }}>
                Oui
              </button>
              <button className={styles.popupAction} onClick={() => {
                setShowConfirmDeconnection(false);
              }}>
                Non
              </button>
            </div>
            </div>
          <div id="float_confirm_delete_station" className={`${styles.float_connection} ${showConfirmDeleteStation ? styles.float_connection_visible : ""}`}>
            <div className={styles.popupBox}>
            <h3 id="delete-station-title">Êtes-vous sûr de vouloir supprimer cette station ?</h3>
            <button className={styles.popupAction} onClick={() => {
                deleteStation(selectedStationIndex);
              }}>
                Oui
              </button>
              <button className={styles.popupAction} onClick={() => {
                setShowConfirmDeleteStation(false);
              }}>
                Non
              </button>
            </div>
            </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
    </div>);
}