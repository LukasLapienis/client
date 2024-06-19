import React, { useEffect, useState } from "react";
import Login from "./Login";
import styles from "./Navigation.module.css";
import logo from "../../assets/Screenshot_2024-05-22_132736-removebg-preview.png";
import Registration from "./Registration";

const BASE_URL = "http://localhost:5000/api/users";

function Navigation({ setUserRole }) {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.token) {
      setIsAuthenticated(true);
      setUsername(userData.username);
    }
  }, []);

  const loggedUsername = JSON.parse(localStorage.getItem("userData"));

  function openLoginModal() {
    setIsOpenLogin(true);
    setIsOpenSignup(false);
  }
  function openSignupModal() {
    setIsOpenSignup(true);
    setIsOpenLogin(false);
  }

  function closeModal() {
    if (isOpenLogin) setIsOpenLogin(false);
    if (isOpenSignup) setIsOpenSignup(false);
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true);
    closeModal();
  }

  function handleLogout() {
    localStorage.removeItem("userData");
    setUserRole("none");
    setIsAuthenticated(false);
  }

  return (
    <nav className={styles.nav}>
      <img src={logo} className={styles.navLogo}></img>
      {!isAuthenticated ? (
        <div className={styles.btnContainer}>
          <button className={styles.btnLogin} onClick={openLoginModal}>
            Login
          </button>
          <button className={styles.btnSign} onClick={openSignupModal}>
            Sign Up
          </button>
        </div>
      ) : (
        <div className={styles.loggedUsername}>
          <h4>Welcome, {loggedUsername.username}</h4>
          <button className={styles.btnSign} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {isOpenLogin && (
        <Login
          closeModal={closeModal}
          BASE_URL={BASE_URL}
          handleLoginSuccess={handleLoginSuccess}
          setUserRole={setUserRole}
          openSignupModal={openSignupModal}
        />
      )}
      {isOpenSignup && (
        <Registration
          closeModal={closeModal}
          BASE_URL={BASE_URL}
          setUserRole={setUserRole}
          openLoginModal={openLoginModal}
        />
      )}
    </nav>
  );
}

export default Navigation;
