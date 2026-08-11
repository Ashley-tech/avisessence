"use client"

import { useEffect, useState } from "react";
import styles from "../app.module.css";
import logo from "../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import connect from "../../public/images/connection.webp"

export default function Composant({stations, users} : any) {
  const [showConnection, setShowConnection] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showModificationInfos, setShowModificationInfos] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [indexUserFound, setIndexUserFound] = useState<number | null>(-1);

  useEffect(() => {
    setUserName(Cookie.get("user_name") ?? null);
  }, []);

  const index = userName ? users.findIndex((user: any) => user.login === userName) : -1;

  function allStations() {
    let s = [];
    for (let i = 0; i < stations.length; i++) {
      let station = stations[i];
      s.push(
        <div key={station._id} className={styles.stationCard} onClick={() => {
          location.href = "/user/station/" + station._id;
        }}>
          <h2>{station.name}</h2>
          <p>{station.localisation.city}</p>
        </div>
      );
    }
    return s;
  }

  function showMaskPassword(id: string) {
    const passwordInput = document.getElementById(id) as HTMLInputElement;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }

  function fenetreSignup() {
    return (
      <div id="float_signup" className={`${styles.float_signup} ${showSignup ? styles.float_signup_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowSignup(false)}>
            ×
          </button>
          <h3>Inscription</h3>
          <table>
            <tbody>
              <tr>
                <td>Identifiant :</td>
                <td><input type="text" id="iden" placeholder="Identifiant" /></td>
              </tr>
              <tr>
                <td>Identifiant (à reconfirmer) :</td>
                <td><input type="text" id="iden_confirm" placeholder="Identifiant" /></td>
              </tr>
              <tr>
                <td>Adresse e-mail :</td>
                <td><input type="text" id="email" placeholder="Adresse e-mail" /></td>
              </tr>
              <tr>
                <td>Adresse e-mail (à reconfirmer) :</td>
                <td><input type="text" id="email_confirm" placeholder="Adresse e-mail" /></td>
              </tr>
              <tr>
                <td>Mot de passe :</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpi" /><button id="display-btn" className="cursor-pointer" onClick={() => showMaskPassword("mdpi")}>Afficher le mot de passe</button></td>
              </tr>
              <tr>
                <td>Mot de passe (à reconfirmer):</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpir" /><button id="display-btn" className="cursor-pointer" onClick={() => showMaskPassword("mdpir")}>Afficher le mot de passe</button></td>
              </tr>
            </tbody>
          </table>
          <p id="error-message-signup-user" className={styles.errorMessage}></p>
          <button className={styles.popupAction} onClick={inscrire}>
            S'inscrire
          </button>
          <button className={styles.popupAction} onClick={() => {
            setShowSignup(false);
            setShowConnection(true);
          }}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  function regex(str: string, pattern: RegExp): boolean {
    return pattern.test(str);
  }

  async function connecter() {
    if (document.getElementById("mdpc") && document.getElementById("idenl")) {
      const mdpc = (document.getElementById("mdpc") as HTMLInputElement).value;
      const iden = (document.getElementById("idenl") as HTMLInputElement).value;
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: iden,
          password: mdpc
        })
      });
      const result = await response.json();
      if (result.success) {
        Cookie.set("user_name", iden);
        setShowConnection(false);
        location.reload();
      } else {
        (document.getElementById("error-message-connection-user") as HTMLParagraphElement).textContent = result.raison || "Erreur lors de la connexion. Veuillez réessayer.";
      }
    }
  }

  async function inscrire() {
    (document.getElementById("message-error-signup-user") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
    if (document.getElementById("iden") && document.getElementById("iden_confirm") && document.getElementById("email") && document.getElementById("email_confirm") && document.getElementById("mdpi") && document.getElementById("mdpir")) {
      const iden = (document.getElementById("iden") as HTMLInputElement).value;
      const iden_confirm = (document.getElementById("iden_confirm") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;
      const email_confirm = (document.getElementById("email_confirm") as HTMLInputElement).value;
      const mdpi = (document.getElementById("mdpi") as HTMLInputElement).value;
      const mdpir = (document.getElementById("mdpir") as HTMLInputElement).value;
      if (iden != iden_confirm) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Les identifiants ne correspondent pas.";
        return;
      }
      if (email != email_confirm) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Les adresses e-mail ne correspondent pas.";
        return;
      }
      if (mdpi != mdpir) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Les mots de passe ne correspondent pas.";
        return;
      }
      if (!regex(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "L'adresse e-mail n'est pas valide.";
        return;
      }
      if (!regex(mdpi, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d-]{8,}$/)) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.";
        return;
      }
      const index = users.findIndex((user: any) => user.login === iden);
      if (users[index].login != userName && index !== -1) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Cet identifiant est déjà utilisé.";
        return;
      }
      const indexEmail = users.findIndex((user: any) => user.mail === email);
      if (indexEmail !== -1 && users[indexEmail].mail != users[index]?.mail) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Cette adresse e-mail est déjà utilisée.";
        return;
      }
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          login: iden,
          mail: email,
          password: mdpi
        })
      });
      const result = await response.json();
      if (result.success) {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Inscription réussie.";
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).style.color = "rgb(0, 255, 0)";
        (document.getElementById("mdpir") as HTMLInputElement).value = "";
        (document.getElementById("mdpi") as HTMLInputElement).value = "";
        (document.getElementById("email_confirm") as HTMLInputElement).value = "";
        (document.getElementById("email") as HTMLInputElement).value = "";
        (document.getElementById("iden_confirm") as HTMLInputElement).value = "";
        (document.getElementById("iden") as HTMLInputElement).value = "";
        setShowSignup(false);
        setShowConnection(true);
      } else {
        (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Erreur lors de l'inscription.";
      }
    } else {
      (document.getElementById("message-error-signup-user") as HTMLParagraphElement).textContent = "Veuillez remplir tous les champs.";
    }
  }

  function fenetreModificationInfos() {
    return (
      <div id="float_modification_infos" className={`${styles.float_modification_infos} ${showModificationInfos ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowModificationInfos(false)}>
            ×
          </button>
          <h3>Modifier vos informations</h3>
          <table>
            <tbody>
              <tr>
                <td>Identifiant* :</td>
                <td><input type="text" placeholder="Identifiant" id="iden_modif" /></td>
              </tr>
              <tr>
                <td>Adresse e-mail* :</td>
                <td><input type="email" placeholder="Adresse e-mail" id="email_modif" /></td>
              </tr>
              <tr>
                <td>Nouveau mot de passe* :</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpi_modif" /></td>
              </tr>
              <tr>
                <td>Nouveau mot de passe (à reconfirmer)* :</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpir_modif" /></td>  
              </tr>
            </tbody>
          </table>
          <p id="message-error-modification-infos"></p>
          <button className={styles.popupAction} onClick={modifierInfos}>
            Enregistrer les modifications
          </button>
          <button className={styles.popupAction} onClick={() => {
            setShowModificationInfos(false);
            setShowConnection(true);
          }}>Annuler les modifications</button>
        </div>
      </div>
    );
  }

  function fenetreForgot() {
    return (
      <div id="float_modification_infos" className={`${styles.float_modification_infos} ${showForgot ? styles.float_modification_infos_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowForgot(false)}>
            ×
          </button>
          <h3>Mot de passe oublié</h3>
          <table>
            <tbody>
              <tr>
                <td>Adresse e-mail* :</td>
                <td><input type="email" placeholder="Adresse e-mail" id="email_forgot" /></td>
              </tr>
              <tr>
                <td colSpan={2}><p id="message-error-forgot-password"></p></td>
              </tr>
              <tr className="invisible">
                <td>Identifiant* :</td>
                <td id="iden_forgot"></td>
              </tr>
              <tr className="invisible">
                <td>Nouveau mot de passe* :</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpi_forgot" /><button id="display-btn" className="cursor-pointer" onClick={() => showMaskPassword("mdpi_forgot")}>Afficher le mot de passe</button></td>
              </tr>
              <tr className="invisible">
                <td>Nouveau mot de passe (à reconfirmer)* :</td>
                <td><input type="password" placeholder="Mot de passe" id="mdpir_forgot" /><button id="display-btn" className="cursor-pointer" onClick={() => showMaskPassword("mdpir_forgot")}>Afficher le mot de passe</button></td>
              </tr>
              <tr className="invisible">
                <td colSpan={2}><p id="message-error-modification-forgot"></p></td>
              </tr>
            </tbody>
          </table>
          <button id="btn_verifier_email" className={styles.popupAction} onClick={verifierEmail}>
            Vérifier l'adresse e-mail
          </button>
          <button id="btn_modifier_mdp" className={`${styles.popupAction} hidden`}>
            Changer le mot de passe
          </button>
          <button className={styles.popupAction} onClick={() => {
            setShowForgot(false);
            setShowConnection(true);
          }}>Retour</button>
        </div>
      </div>
    );
  }

  async function modifierMotDePasse() {
    const mdpi_forgot = (document.getElementById("mdpi_forgot") as HTMLInputElement).value;
    const mdpir_forgot = (document.getElementById("mdpir_forgot") as HTMLInputElement).value;
    const email_forgot = (document.getElementById("email_forgot") as HTMLInputElement).value;
    console.log("a")
    if (mdpi_forgot === "" || mdpir_forgot === "") {
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = "Les champs de mot de passe ne peuvent pas être vides.";
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    if (mdpi_forgot !== mdpir_forgot) {
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = "Les mots de passe ne correspondent pas.";
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    try {
      const response = await fetch(`/api/forgot-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mail: email_forgot, newPassword: mdpi_forgot })
      });
      const data = await response.json();
      if (data.success) {
        const messageElement = document.getElementById("message-error-modification-forgot") as HTMLParagraphElement;
        messageElement.textContent = "Le mot de passe a été modifié avec succès. Retour à la connexion dans 1 seconde...";
        messageElement.style.color = "rgb(0, 255, 0)";

        setTimeout(() => {
          setShowForgot(false);
          setShowConnection(true);
        }, 1000);
      } else {
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = data.raison;
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      }
    } catch (error) {
      console.error("Error occurred while modifying password:", error);
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = "Une erreur s'est produite lors de la modification du mot de passe.";
      (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
    }
  }

  async function verifierEmail() {
    const email_forgot = (document.getElementById("email_forgot") as HTMLInputElement).value;
    if (email_forgot === "") {
      (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).textContent = "L'adresse e-mail est obligatoire.";
      (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    try {
      const response = await fetch(`/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mail: email_forgot })
      });
      const data = await response.json();
      if (data.success) {
        (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).textContent = "Adresse e-mail trouvée. Vous pouvez maintenant modifier votre mot de passe.";
        (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).style.color = "rgb(0, 128, 0)";
        (document.getElementById("iden_forgot") as HTMLTableCellElement).textContent = data.data[0].login;
        (document.getElementById("mdpi_forgot") as HTMLInputElement).value = "";
        (document.getElementById("mdpir_forgot") as HTMLInputElement).value = "";
        (document.getElementById("mdpi_forgot") as HTMLInputElement).parentElement!.parentElement!.classList.remove("invisible");
        (document.getElementById("mdpir_forgot") as HTMLInputElement).parentElement!.parentElement!.classList.remove("invisible");
        (document.getElementById("iden_forgot") as HTMLTableCellElement).parentElement!.classList.remove("invisible");
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = "";
        console.log("message-error-modification-forgot", document.getElementById("message-error-modification-forgot")?.parentElement?.parentElement?.classList);
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).parentElement!.parentElement!.classList.remove("invisible");
        (document.getElementById("btn_verifier_email") as HTMLButtonElement).classList.add("hidden");
        (document.getElementById("btn_modifier_mdp") as HTMLButtonElement).classList.remove("hidden");
        (document.getElementById("btn_modifier_mdp") as HTMLButtonElement).addEventListener("click", modifierMotDePasse);
        const indexF = users.findIndex((user: any) => user.mail === email_forgot);
        setIndexUserFound(indexF);
      } else {
        (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).textContent = "Votre adresse e-mail n'existe pas dans notre base de données.";
        (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'adresse e-mail :", error);
      (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).textContent = "Une erreur s'est produite. Veuillez réessayer.";
      (document.getElementById("message-error-forgot-password") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
    }
  }

  async function modifierInfos() {
    const iden_modif = (document.getElementById("iden_modif") as HTMLInputElement).value;
    const email_modif = (document.getElementById("email_modif") as HTMLInputElement).value;
    const mdpi_modif = (document.getElementById("mdpi_modif") as HTMLInputElement).value;
    const mdpir_modif = (document.getElementById("mdpir_modif") as HTMLInputElement).value;
    const oldPwd = users[index]?.password;
    if (iden_modif === "" || email_modif === "") {
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "L'identifiant et l'adresse e-mail sont obligatoires.";
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    if (mdpi_modif !== "" || mdpir_modif !== "") {
      if (mdpir_modif !== mdpi_modif) {
        (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Les mots de passe ne correspondent pas.";
        (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
        return;
      }
      if (!regex(mdpi_modif, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d-]{8,}$/)) {
        (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.";
        (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
        return;
      }
    }
    const indexIden = users.findIndex((user: any) => user.login === iden_modif);
    if (indexIden !== -1 && indexIden !== index) {
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Cet identifiant est déjà utilisé.";
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    const indexEmail = users.findIndex((user: any) => user.mail === email_modif);
    if (indexEmail !== -1 && indexEmail !== index) {
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Cette adresse e-mail est déjà utilisée.";
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
      return;
    }
    const response = await fetch(`/api/users/${users[index]?._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login: iden_modif,
        mail: email_modif,
        password: mdpi_modif || oldPwd
      })
    });
    const result = await response.json();
    if (result.success) {
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Informations mises à jour avec succès.";
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(0, 255, 0)";
      if (userName !== iden_modif) {
        Cookie.set("user_name", iden_modif);
      }
      document.getElementById('userLi')!.textContent = iden_modif;
      document.getElementById('emailLi')!.textContent = email_modif;
      document.getElementById('password-length')!.textContent = (mdpi_modif || oldPwd).length.toString();
      setShowModificationInfos(false);
    } else {
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).textContent = "Erreur lors de la mise à jour des informations.";
      (document.getElementById("message-error-modification-infos") as HTMLParagraphElement).style.color = "rgb(255, 0, 0)";
    }
  }

  function openForgotPassword() {
    setShowForgot(true);
    setShowConnection(false);
    (document.getElementById("email_forgot") as HTMLInputElement).value = "";
    document.getElementById("message-error-forgot-password")!.textContent = "";
    (document.getElementById("mdpi_forgot") as HTMLInputElement).parentElement!.parentElement!.classList.add("invisible");
        (document.getElementById("mdpir_forgot") as HTMLInputElement).parentElement!.parentElement!.classList.add("invisible");
        (document.getElementById("iden_forgot") as HTMLTableCellElement).parentElement!.classList.add("invisible");
        (document.getElementById("btn_verifier_email") as HTMLButtonElement).classList.remove("hidden");
        (document.getElementById("btn_modifier_mdp") as HTMLButtonElement).classList.add("hidden");
        console.log("d",document.getElementById("message-error-modification-forgot"));
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).textContent = "";
        (document.getElementById("message-error-modification-forgot") as HTMLParagraphElement).parentElement!.parentElement!.classList.add("invisible");
  }

  function fenetreConnection() {
    return (
      <div id="float_connection" className={`${styles.float_connection} ${showConnection ? styles.float_connection_visible : ""}`}>
        <div className={styles.popupBox}>
          <button type="button" className={styles.popupClose} onClick={() => setShowConnection(false)}>
            ×
          </button>
          {userName ? (
            <>
              <h3>Vos informations</h3>
              <p>Vous êtes connecté en tant que : <strong id="userLi">{userName}</strong></p>
              <p>Votre adresse e-mail est : <strong id='emailLi'>{users[index]?.mail}</strong></p>
              <p>Votre mot de passe contient <strong id="password-length">{users[index]?.password.length}</strong> caractère(s)</p>
              <button className={styles.popupAction} onClick={() => {
                setShowConnection(false);
                setShowModificationInfos(true);
                (document.getElementById("mdpi_modif") as HTMLInputElement).value = "";
                (document.getElementById("mdpir_modif") as HTMLInputElement).value = "";
                (document.getElementById("iden_modif") as HTMLInputElement).value = users[index]?.login;
                (document.getElementById("email_modif") as HTMLInputElement).value = users[index]?.mail;
              }}>
                Modifier vos informations
              </button>
              <button className={styles.popupAction} onClick={() => {
                setShowConnection(false);
                setShowConfirmLogout(true);
              }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <h3>Connexion</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Identifiant :</td>
                    <td><input type="text" placeholder="Identifiant" id="idenl" /></td>
                  </tr>
                  <tr>
                    <td>Mot de passe :</td>
                    <td><input type="password" placeholder="Mot de passe" id="mdpc" /><button id="display-btn" className="cursor-pointer" onClick={() => showMaskPassword("mdpc")}>Afficher le mot de passe</button></td>
                  </tr>
                </tbody>
              </table>
              <p id="error-message-connection-user" className={styles.errorMessage}></p>
              <button className={styles.popupAction} onClick={connecter}>
              Se connecter
            </button>
            <button className={styles.popupAction} onClick={openForgotPassword}>
              Mot de passe oublié
            </button>
            <button className={styles.popupAction} onClick={() => {
              setShowConnection(false);
              setShowSignup(true);
              (document.getElementById("mdpir") as HTMLInputElement).value = "";
              (document.getElementById("mdpi") as HTMLInputElement).value = "";
              (document.getElementById("email_confirm") as HTMLInputElement).value = "";
              (document.getElementById("email") as HTMLInputElement).value = "";
              (document.getElementById("iden_confirm") as HTMLInputElement).value = "";
              (document.getElementById("iden") as HTMLInputElement).value = "";
              (document.getElementById("error-message-signup-user") as HTMLParagraphElement).textContent = "";
            }}>
              Inscription
            </button>
            </>
          )}
        </div>
      </div>
    );
  }

  function connectedBool() {
    if (userName) {
      let index = users.findIndex((user: any) => user.login === userName);
      return users[index]?.login ?? "Se connecter";
    }
    return "Se connecter";
  }

  function openConnection() {
    setShowConnection(true);
    if (!userName) {
      (document.getElementById("mdpc") as HTMLInputElement).value = "";
      (document.getElementById("idenl") as HTMLInputElement).value = "";
      document.getElementById("error-message-connection-user")!.textContent = "";
    }
  }

  return (
    <div>
      <div className={styles.header}>
            <nav className="w-full flex justify-between items-center">
                <ul className={styles.nav_links}>
                  <li className="cursor-pointer" onClick={() => openConnection()}>
                    <Image src={connect} width={30} height={30} alt="Connect" />
                    {connectedBool()}
                  </li>
                </ul>
            </nav>
        </div>
        <div className={styles.section}>
          <div className={styles.content}>
            <Image src={logo} className="cursor-pointer" width={300} height={300} alt="Logo" onClick={() => location.href = "/"}/>
            <div className={styles.stationsContainer}>
              {allStations()}
            </div>
            <button className={styles.bigbutton} onClick={() => location.href = "/"} id="candidatures-button">
              <span className={styles.buttonTitle}>Retour</span>
            </button>
          </div>
        </div>
        <div className={styles.footer}>
            <p>© 2026 AvisEssence. Tous droits réservés.</p>
        </div>
        {fenetreConnection()}
        {fenetreSignup()}
        {fenetreModificationInfos()}
        {fenetreForgot()}
        <div id="float_confirm_logout" className={`${styles.float_connection} ${showConfirmLogout ? styles.float_connection_visible : ""}`}>
          <div className={styles.popupBox}>
            <h1>Êtes-vous sûr de vouloir vous déconnecter ?</h1>
            <button className={styles.popupAction} onClick={() => {
                  Cookie.remove("user_name");
                  setShowConfirmLogout(false);
                  location.reload();
              }}>
                Oui
              </button>
              <button className={styles.popupAction} onClick={() => {
                  setShowConfirmLogout(false);
                  setShowConnection(true);
              }}>
                Non
              </button>
          </div>
        </div>
    </div>
  );
}