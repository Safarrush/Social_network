import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import styles from "./layout.module.scss";

export const Layout = () => {
  return (
    <div className="container">
      <Header />
      <main>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
