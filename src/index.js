import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./views/Login";
import Profile from "./views/profile";
import Register from "./views/Register";
import Details from "./views/Details";
import Calendar from "./views/Calendar";
import Canchas from "./views/Canchas";
import Editar from "./views/admin/Editar";
import CanchasAdmin from "./views/admin/Canchas";
import RegisterCancha from "./views/RegisterCancha";
import Lobby from "./views/Lobby.js";

import FAQ from "./views/FAQ.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/registerCancha",
    element: <RegisterCancha />,
  },
  {
    path: "/profile",
    element: <Profile></Profile>,
  },
  {
    path: "/canchas",
    element: <Canchas></Canchas>,
  },
  {
    path: "/admin/",
    element: <CanchasAdmin></CanchasAdmin>,
  },
  {
    path: "/admin/editar/:id",
    element: <Editar></Editar>,
  },
  {
    path: "/details/:id",
    element: <Details></Details>,
  },
  {
    path: "/admin/Calendar/:id",
    element: <Calendar></Calendar>,
  },
  {
    path: "/FAQ",
    element: <FAQ></FAQ>,
  },
  {
    path: "/lobby",
    element: <Lobby></Lobby>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
