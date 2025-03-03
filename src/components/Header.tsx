import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSession } from "../contexts";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetSession } = useSession();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    resetSession();
    navigate({
      to: "/",
    });
  };

  return (
    <header>
      <div className={styles.logoGroup}>
        <img
          src="/bulldog.svg"
          alt="A brown cartoon bulldog in a sitting position."
        />
        <h1>Mutts & Matches</h1>
      </div>
      {location.pathname === "/search" && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
