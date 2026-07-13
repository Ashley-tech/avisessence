"use client"

import { useState } from "react";
import styles from "../app.module.css";
import logo from "../../public/images/logo.webp"
import Image from "next/image"
import Cookie from "js-cookie";
import connect from "../../public/images/connection.webp"

export default function Composant({stations, users} : any) {
  const [showConnection, setShowConnection] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const userName = Cookie.get("user_name");

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
        alert("Erreur lors de la connexion. Les identifiants sont incorrects.");
      }
    }
  }

  async function inscrire() {
    if (document.getElementById("iden") && document.getElementById("iden_confirm") && document.getElementById("email") && document.getElementById("email_confirm") && document.getElementById("mdpi") && document.getElementById("mdpir")) {
      const iden = (document.getElementById("iden") as HTMLInputElement).value;
      const iden_confirm = (document.getElementById("iden_confirm") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;
      const email_confirm = (document.getElementById("email_confirm") as HTMLInputElement).value;
      const mdpi = (document.getElementById("mdpi") as HTMLInputElement).value;
      const mdpir = (document.getElementById("mdpir") as HTMLInputElement).value;
      if (iden != iden_confirm) {
        alert("Les identifiants ne correspondent pas.");
        return;
      }
      if (email != email_confirm) {
        alert("Les adresses e-mail ne correspondent pas.");
        return;
      }
      if (mdpi != mdpir) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!regex(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert("L'adresse e-mail n'est pas valide.");
        return;
      }
      if (!regex(mdpi, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d-]{8,}$/)) {
        alert("Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre et un chiffre.");
        return;
      }
      const index = users.findIndex((user: any) => user.login === iden);
      if (index !== -1) {
        alert("Cet identifiant est déjà utilisé.");
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
        alert("Inscription réussie.");
        (document.getElementById("mdpir") as HTMLInputElement).value = "";
        (document.getElementById("mdpi") as HTMLInputElement).value = "";
        (document.getElementById("email_confirm") as HTMLInputElement).value = "";
        (document.getElementById("email") as HTMLInputElement).value = "";
        (document.getElementById("iden_confirm") as HTMLInputElement).value = "";
        (document.getElementById("iden") as HTMLInputElement).value = "";
        setShowSignup(false);
        setShowConnection(true);
      } else {
        alert("Erreur lors de l'inscription.");
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
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
              <h3>Êtes-vous sûr de vouloir vous déconnecter ?</h3>
              <button className={styles.popupAction} onClick={() => {
                Cookie.remove("user_name");
                setShowConnection(false);
                location.reload();
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
              <button className={styles.popupAction} onClick={connecter}>
              Se connecter
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
      let index = users.findIndex((user: any) => user.login === userName && user.type === "Local");
      return users[index]?.login ?? "Se connecter";
    }
    return "Se connecter";
  }

  return (
    <div>
      <div className={styles.header}>
            <nav className="w-full flex justify-between items-center">
                <ul className={styles.nav_links}>
                  <li className="cursor-pointer" onClick={() => setShowConnection(true)}>
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
    </div>
  );
}