"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdmin, isLogin } from "./auth";

export default function Header() {
  const [admin, setAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setAdmin(localStorage.getItem("isAdmin") === "true");
    setIsLoggedIn(isLogin());
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">DK Boss Panel</a>
          {isLoggedIn && (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" href="/">My Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" href="/data">View Data</Link>
                  </li>
                  {admin && (
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Users
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li>
                          <Link className="dropdown-item" href="/users/add">Add User</Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/users">User Lists</Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" href="/logout">Logout</Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
