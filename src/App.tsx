import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome";
import CareersPage from "./pages/CareersPage";
import { Career } from "./common/interfaces/Career";
import { createElement } from "react";
import AddSeasons from "./pages/AddSeasons";
import Season from "./pages/Season";
import AddPlayers from "./pages/AddPlayers";
import Geral from "./pages/Geral";
import Players from "./pages/Players";

type AppProps = {
  career?: Career;
};

export default function App({ career }: AppProps) {
  const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/Career/:careerId/Geral", element: <Geral /> },
    { path: "/Career/:careerId/Geral/Player/:playerId", element: <Players /> },
    { path: "/Career/:careerId", element: <AddSeasons /> },
    { path: "/Career/:careerId/Season/:seasonId", element: <Season /> },
    {
      path: "/CareersPage",
      element: createElement(CareersPage, { career }),
    },
    {
      path: "/Career/:careerId/Season/:seasonId/AddPlayer",
      element: <AddPlayers />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/EditPlayer/:playerId",
      element: <AddPlayers />,
    },
  ]);

  return <RouterProvider router={router} />;
}
