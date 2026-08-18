"use client"

import { useState, useEffect } from "react";
import styles from "../../app.module.css";
import logo from "../../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";

export default function Composant({stations, users} : any) {
    const [showConfirmDeconnection, setShowConfirmDeconnection] = useState(false);
    const [showNewStation, setShowNewStation] = useState(false);
    const [showModifyStation, setShowModifyStation] = useState(false);
    const [selectedStationIndex, setSelectedStationIndex] = useState<number>(-1);
    const [selectedCarburantIndex, setSelectedCarburantIndex] = useState<number>(-1);
    const [showConfirmDeleteStation, setShowConfirmDeleteStation] = useState(false);
    const [showNewCarburant, setShowNewCarburant] = useState(false);
    const [showModifyCarburant, setShowModifyCarburant] = useState(false);
    const [showConfirmDeleteCarburant, setShowConfirmDeleteCarburant] = useState(false);
    const [showModifyAdminInfos, setShowModifyAdminInfos] = useState(false);
    const [prix, setPrix] = useState<string>("0");
    const [showInfos, setShowInfos] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [debugStations, setDebugStations] = useState<any | null>(null);

    const initialStations = Array.isArray(stations) ? stations : stations?.data ?? [];
    const [localStations, setLocalStations] = useState<any[]>(initialStations);

    useEffect(() => {
      setLocalStations(initialStations);
      refreshStations();
    }, [stations]);

    async function refreshStations() {
      setShowNewStation(false)
      setShowNewCarburant(false)
      setShowConfirmDeleteCarburant(false)
      setShowConfirmDeleteStation(false)
      setShowModifyCarburant(false)
      setShowModifyStation(false)
      setShowModifyAdminInfos(false)
      
      try {
        const res = await fetch('/api/stations');
        const txt = await res.text();
        let parsed: any = null;
        try { parsed = txt ? JSON.parse(txt) : null } catch (e) { parsed = txt }
        const newList = parsed?.data ?? parsed ?? [];
        setLocalStations(Array.isArray(newList) ? newList : []);
      } catch (e) {
        console.error('refreshStations failed', e);
      }
    }
    const [userName, setUserName] = useState<string>("");
    useEffect(() => {
      const cookieUser = Cookie.get("user_name") || "";
      setUserName(cookieUser);
    }, []);
    const index = users.findIndex((user: any) => user.type == "Administrator" && user.login == userName);
    const oldPassword = users[index]?.password || "";

    function openModifyCarburantPopup(stationIndex: number, carburantIndex: number) {
      setSelectedStationIndex(stationIndex);
      setSelectedCarburantIndex(carburantIndex);
      const station = localStations[stationIndex];
      if (!station || !Array.isArray(station.carburants) || !station.carburants[carburantIndex]) {
        console.error('Carburant introuvable pour', stationIndex, carburantIndex, station);
        alert('Carburant introuvable. Vérifiez la console pour plus de détails.');
        return;
      }
      (document.getElementById("nomeu") as HTMLInputElement).value = station.carburants[carburantIndex].name;
      setPrix(station.carburants[carburantIndex].price.toString());
        document.getElementById("error-message-uc")!.textContent = "";
        (document.getElementById("popup-title-modify-carburant") as HTMLHeadingElement).textContent = `Modifier le carburant "${station.carburants[carburantIndex].name}" pour la station "${station.name}"`;
        setShowModifyCarburant(true);
    }

    async function updateCarburant(stationIndex: number, carburantIndex: number) {
        const nomInput = document.getElementById("nomeu") as HTMLInputElement;
        const prixInput = document.getElementById("prixu") as HTMLInputElement;
        if (nomInput.value == "" || prixInput.value == "") {
            document.getElementById("error-message-uc")!.textContent = "Un champ ne peut pas être vide. Veuillez remplir tous les champs obligatoires.";
            return;
        }
        if (isNaN(parseFloat(prixInput.value)) || parseFloat(prixInput.value) < 0) {
            document.getElementById("error-message-uc")!.textContent = "Le prix doit être un nombre valide et positif.";
            return;
        }
        try {
          const response = await fetch(`/api/stations/${localStations[stationIndex]._id}/${carburantIndex}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: nomInput.value,
                price: parseFloat(prixInput.value)
              })
            });
            const result = await response.json();
            if (result.success) {
                location.reload();
            } else {
                document.getElementById("error-message-uc")!.textContent = result.raison || "Erreur lors de la mise à jour du carburant. Veuillez réessayer.";
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du carburant :", error);
            document.getElementById("error-message-uc")!.textContent = "Erreur lors de la mise à jour du carburant. Veuillez réessayer.";
        }
      }

    async function deleteCarburant(stationIndex: number, carburantIndex: number) {
        let data: any = { success: false, raison: 'Erreur lors de la suppression du carburant. Veuillez réessayer.' };
        try {
        const response = await fetch(`/api/stations/${localStations[stationIndex]._id}/${carburantIndex}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            data = result;
            if (data.success) {
          await refreshStations();
            } else {
              alert(data.raison || 'Erreur lors de la suppression du carburant. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du carburant :', error);
            alert('Erreur lors de la suppression du carburant. Veuillez réessayer.');
        }
      }

      function openConfirmDeleteCarburantPopup(stationIndex: number, carburantIndex: number) {
        setShowModifyCarburant(false);
        setShowConfirmDeleteCarburant(true);
      }

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
          console.log('addStation response status:', response.status, 'body:', responseText);
          try {
            data = responseText ? JSON.parse(responseText) : { success: false, raison: `Serveur répondu avec statut ${response.status} mais corps vide` };
          } catch (err) {
            console.error('JSON parse error for addStation response:', err);
            data = { success: false, raison: `Réponse invalide du serveur (status ${response.status})` };
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la station:', error);
          data = { success: false, raison: 'Erreur réseau ou impossibilité de joindre l\'API. Voir console pour détails.' };
        }

        if (data.success) {
          await refreshStations();
        } else {
            document.getElementById("error-message")!.textContent = data.raison || 'Erreur lors de l\'ajout de la station. Veuillez réessayer.';
        }
    }

    async function deleteStation(indexStation: number) {
        let data: any = { success: false, raison: 'Erreur lors de la suppression de la station. Veuillez réessayer.' };
        try {
          const response = await fetch(`/api/stations/${localStations[indexStation]._id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          data = result;
          if (data.success) {
            await refreshStations();
          } else {
            document.getElementById("error-message")!.textContent = data.raison || 'Erreur lors de la suppression de la station. Veuillez réessayer.';
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la station:', error);
        }
      }
      
        function openNewCarburantPopup(stationIndex: number) {
        setSelectedStationIndex(stationIndex);
        (document.getElementById("nome") as HTMLInputElement).value = "";
        (document.getElementById("prix") as HTMLInputElement).value = "";
        document.getElementById("error-message-nc")!.textContent = "";
        (document.getElementById("popup-title-new-carburant") as HTMLHeadingElement).textContent = `Ajouter un nouveau carburant pour la station "${localStations[stationIndex]?.name}"`;
        setShowNewCarburant(true);
      }

      async function updateAdminInfos() {
        const loginInput = document.getElementById("login") as HTMLInputElement;
        const mailInput = document.getElementById("mail") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        const passwordConfirmInput = document.getElementById("password-confirm") as HTMLInputElement;

        if (loginInput.value == "" || mailInput.value == "") {
            document.getElementById("error-message-infos")!.textContent = "Le login et le mail ne peuvent pas être vides. Veuillez remplir tous les champs obligatoires.";
            return;
        }
        if (passwordInput.value != "" || passwordConfirmInput.value != "") {
            if (passwordInput.value != passwordConfirmInput.value) {
                document.getElementById("error-message-infos")!.textContent = "Les mots de passe ne correspondent pas. Veuillez réessayer.";
                return;
            }
        }
    
        var newPassword = passwordInput.value;
        if (passwordInput.value == "" && passwordConfirmInput.value == "") {
            newPassword = oldPassword;
        }

            const ind = users.findIndex((user: any) => user.login === loginInput.value && user.login !== userName);
        if (ind !== -1) {
          document.getElementById("error-message-infos")!.textContent = "Cet identifiant est déjà utilisé. Veuillez en choisir un autre.";
          return;
        }

        try {
            const response = await fetch('/api/login/admin', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: loginInput.value,
                    mail: mailInput.value,
                    password: newPassword
                })
            });
            const data = await response.json();
            if (data.success) {
              Cookie.set("user_name", loginInput.value);
                setShowModifyAdminInfos(false);
                setShowSuccess(true);
            } else {
                document.getElementById("error-message-infos")!.textContent = data.raison || "Erreur lors de la mise à jour des informations de l'administrateur. Veuillez réessayer.";
            }
        } catch (error) {
            document.getElementById("error-message-infos")!.textContent = "Erreur lors de la mise à jour des informations de l'administrateur. Veuillez réessayer.";
        }
      }

      async function addCarbrant(indexStation: number) {
        const nomInput = document.getElementById("nome") as HTMLInputElement;
        const prixInput = document.getElementById("prix") as HTMLInputElement;
        if (nomInput.value == "" || prixInput.value == "") {
            document.getElementById("error-message-nc")!.textContent = "Veuillez remplir tous les champs obligatoires.";
            return;
        }
        if (isNaN(parseFloat(prixInput.value)) || parseFloat(prixInput.value) < 0) {
            document.getElementById("error-message-nc")!.textContent = "Le prix doit être un nombre positif.";
            return;
        }
        try {
            const response = await fetch(`/api/stations/${localStations[indexStation]._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nomInput.value,
                    price: parseFloat(prixInput.value)
                })
            });
            const data = await response.json();
            if (data.success) {
              await refreshStations();
            } else {
              document.getElementById("error-message-nc")!.textContent = data.raison || "Erreur lors de l'ajout du carburant. Veuillez réessayer.";
            }
        } catch (error) {
            document.getElementById("error-message-nc")!.textContent = "Erreur lors de l'ajout du carburant. Veuillez réessayer.";
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
            const response = await fetch(`/api/stations/${localStations[selectedStationIndex]._id}`, {
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
          await refreshStations();
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
        (document.getElementById("delete-station-title") as HTMLHeadingElement).textContent = `Êtes-vous sûr de vouloir supprimer la station "${localStations[stationIndex]?.name}" ?`;
    }

    function openModifyAdminInfosPopup() {
      setShowModifyAdminInfos(true);
        (document.getElementById("login") as HTMLInputElement).value = users[0].login;
        (document.getElementById("mail") as HTMLInputElement).value = users[0].mail;
        (document.getElementById("password") as HTMLInputElement).value = "";
        (document.getElementById("password-confirm") as HTMLInputElement).value = "";
        document.getElementById("error-message-infos")!.textContent = "";
    }

    function openModifyStationPopup(stationIndex: number) {
        setSelectedStationIndex(stationIndex);
        const station = localStations[stationIndex];
        (document.getElementById("nomm") as HTMLInputElement).value = station?.name ?? "";
        (document.getElementById("marquem") as HTMLInputElement).value = station?.mark ?? "";
        (document.getElementById("adressem") as HTMLInputElement).value = station?.localisation?.adress ?? "";
        (document.getElementById("code-postalm") as HTMLInputElement).value = station?.localisation?.postalCode ?? "";
        (document.getElementById("villem") as HTMLInputElement).value = station?.localisation?.city ?? "";
        (document.getElementById("departementm") as HTMLInputElement).value = station?.localisation?.department ?? "";
        (document.getElementById("regionm") as HTMLInputElement).value = station?.localisation?.region ?? "";
        document.getElementById("error-message-2")!.textContent = "";
        (document.getElementById("popup-title-update") as HTMLHeadingElement).textContent = `Modifier les informations de la station "${station?.name ?? ''}"`;
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
                        {localStations.map((station: any) => {
                            const carburants = Array.isArray(station?.carburants) ? station.carburants : [];
                            console.debug('Rendering station', station?._id, 'carburants:', carburants);
                            return (
                                <tr key={station._id ?? Math.random()} className="border-y border-gray-600">
                                    <td>{station?.name ?? '—'}</td>
                                    <td>{station?.mark ?? '—'}</td>
                                    <td>{station?.localisation?.adress ?? ''}{station?.localisation ? `, ${station.localisation.postalCode}, ${station.localisation.city} (${station.localisation.department}, ${station.localisation.region})` : ''}</td>
                                    <td>
                                      {carburants.length === 0 ? (
                                        <span>Aucun carburant</span>
                                      ) : (
                                        carburants.map((c: any, index: number) => (
                                        <span key={index}>
                                          {c?.name ?? '—'} {c?.price === 0 ? "en RUPTURE" : `à ${c?.price}€/litre`}
                                          <button className={styles.smallbutton} onClick={() => {
                                            const idx = localStations.findIndex((s: any) => s._id === station._id);
                                            setSelectedStationIndex(idx);
                                            setSelectedCarburantIndex(index);
                                            openModifyCarburantPopup(idx, index);
                                          }}>
                                            Modifier
                                          </button>
                                          {index < carburants.length - 1 ? " - " : ""}
                                        </span>
                                        ))
                                      )}
                                    </td>
                                    <td>
                                        <button className={styles.smallbutton} onClick={() => openModifyStationPopup(localStations.findIndex((s: any) => s._id === station._id))}>
                                            Modifier
                                        </button><br />
                                        <button className={styles.smallbutton} onClick={() => openNewCarburantPopup(localStations.findIndex((s: any) => s._id === station._id))}>
                                            Nouveau carburant
                                        </button><br />
                                        <button className={styles.smallbutton} onClick={() => openConfirmDeleteStationPopup(localStations.findIndex((s: any) => s._id === station._id))}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{marginTop: 12}}>
              <button className={styles.smallbutton} onClick={async () => {
                setShowDebug((s) => !s);
                try {
                  const res = await fetch('/api/stations');
                  const txt = await res.text();
                  let parsed = null;
                  try { parsed = txt ? JSON.parse(txt) : null } catch(e) { parsed = txt }
                  setDebugStations(parsed);
                  console.log('debug /api/stations', res.status, parsed);
                } catch (e) {
                  console.error('Debug fetch /api/stations failed', e);
                  setDebugStations({ error: 'Fetch failed', details: String(e) });
                }
              }}>{showDebug ? 'Cacher debug' : 'Afficher debug /api/stations'}</button>
              {showDebug && <pre style={{maxHeight: 300, overflow: 'auto', background: '#111', color: '#dcdcdc', padding: 8}}>{JSON.stringify(debugStations, null, 2)}</pre>}
            </div>
            <button className={styles.bigbutton} id="nouvelle-station-button" onClick={openNewStationPopup}>
              <span className={styles.buttonTitle}>Nouvelle station</span>
            </button>
            <button className={styles.bigbutton} id="modifier-informations-button" onClick={() => setShowInfos(true)}>
              <span className={styles.buttonTitle}>Vos informations administratives</span>
            </button>
            <button className={styles.bigbutton} id="deconnect-button" onClick={() => setShowConfirmDeconnection(true)}>
              <span className={styles.buttonTitle}>Déconnexion</span>
            </button>
            <button className={styles.bigbutton} onClick={() => location.href = "/"} id="retour-button">
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
      <div id="float_modifyinfos" className={`${styles.float_modification_infos} ${showInfos ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowInfos(false)}>
            ×
          </button>
          <h3>Vos informations</h3>
              <p>Vous êtes connecté en tant que : <strong id="userLi">{userName}</strong></p>
              <p>Votre adresse e-mail est : <strong id='emailLi'>{users[index]?.mail}</strong></p>
              <p>Votre mot de passe contient <strong id="password-length">{users[index]?.password.length}</strong> caractère(s)</p>
              <button className={styles.popupAction} onClick={() => {
                setShowInfos(false);
                openModifyAdminInfosPopup();
              }}>
                Modifier vos informations
              </button>
        </div>
      </div>
      <div id="float_modifyinfos" className={`${styles.float_modification_infos} ${showModifyAdminInfos ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowModifyAdminInfos(false)}>
            ×
          </button>
          <h3>Modifier vos informations administratives</h3>
          <table>
            <tbody>
              <tr>
                <td>Login* :</td>
                <td><input type="text" placeholder="Login" id="login" /></td>
              </tr>
              <tr>
                <td>Mail* :</td>
                <td><input type="email" placeholder="Mail" id="mail" /></td>
              </tr>
              <tr>
                <td>Nouveau mot de passe :</td>
                <td><input type="password" placeholder="Nouveau mot de passe" id="password" /></td>
              </tr>
              <tr>
                <td>Nouveau mot de passe (à reconfirmer) :</td>
                <td><input type="password" placeholder="Nouveau mot de passe (à reconfirmer)" id="password-confirm" /></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message-infos" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={() => {
            updateAdminInfos();
          }}>
            Modifier
          </button>
          <button className={styles.popupAction} onClick={() => {
            setShowModifyAdminInfos(false);
            setShowInfos(true);
          }}>
            Annuler
          </button>
        </div>
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
      <div id="float_nc" className={`${styles.float_modification_infos} ${showNewCarburant ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowNewCarburant(false)}>
            ×
          </button>
          <h3 id="popup-title-new-carburant">Ajouter un nouveau carburant</h3>
          <table>
            <tbody>
              <tr>
                <td>Nom* :</td>
                <td><input type="text" placeholder="Nom" id="nome" /></td>
              </tr>
              <tr>
                <td>Prix* :</td>
                <td><input
                  type="number"
                  placeholder="Prix"
                  id="prix"
                  min="0"
                  step="0.001"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                /></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message-nc" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={() => addCarbrant(selectedStationIndex)}>
            Ajouter
          </button>
        </div>
      </div>
      <div id="float_ncu" className={`${styles.float_modification_infos} ${showSuccess ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowModifyCarburant(false)}>
            ×
          </button>
          <h3 id="popup-title-modify-carburant">Vos informations administratives ont été mises à jour avec succès.</h3>
          <button className={styles.popupAction} onClick={() => location.reload()}>
            OK
            </button>
        </div>
      </div>
      <div id="float_ncu" className={`${styles.float_modification_infos} ${showModifyCarburant ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowModifyCarburant(false)}>
            ×
          </button>
          <h3 id="popup-title-modify-carburant">Modifier le carburant</h3>
          <table>
            <tbody>
              <tr>
                <td>Nom* :</td>
                <td><input type="text" placeholder="Nom" id="nomeu" /></td>
              </tr>
              <tr>
                <td>Prix* :</td>
                <td><input
                  type="number"
                  placeholder="Prix"
                  id="prixu"
                  min="0"
                  step="0.001"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                /></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message-uc" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={() => updateCarburant(selectedStationIndex, selectedCarburantIndex)}>
            Modifier
          </button>
          <button className={styles.popupAction} onClick={() => openConfirmDeleteCarburantPopup(selectedStationIndex, selectedCarburantIndex)}>
            Supprimer ce carburant
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
          <div id="float_confirm_delete_carburant" className={`${styles.float_connection} ${showConfirmDeleteCarburant ? styles.float_connection_visible : ""}`}>
            <div className={styles.popupBox}>
            <h3 id="delete-carburant-title">Êtes-vous sûr de vouloir supprimer ce carburant ?</h3>
            <button className={styles.popupAction} onClick={() => {
                deleteCarburant(selectedStationIndex, selectedCarburantIndex);
              }}>
                Oui
              </button>
              <button className={styles.popupAction} onClick={() => {
                setShowConfirmDeleteCarburant(false);
                setShowModifyCarburant(true);
              }}>
                Non
              </button>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
            <div className={styles.links}>
              <a
                  href="https://github.com/Ashley-tech/avisessence"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  GitHub
              </a>
               -
               <a
                  href="https://www.youtube.com/watch?v=qMahujlZvRM"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  Vidéo de présentation sur YouTube
              </a>
            </div>
        </div>
    </div>);
}