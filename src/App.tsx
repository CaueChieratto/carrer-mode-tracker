import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome";
import CareersPage from "./pages/CareersPage";
import { Career } from "./common/interfaces/Career";
import { createElement } from "react";
import AddSeasons from "./pages/AddSeasons";
import Season from "./pages/Season";
import Geral from "./pages/Geral";
import Players from "./pages/Players";
import Tutorial from "./pages/Tutorial";
import { Match } from "./pages/Match";
import { useIsMobile } from "./common/hooks/useIsMobile";
import { ComparePlayers } from "./pages/ComparePlayers";
import { Academy } from "./pages/Academy";
import { GroupCareerPage } from "./pages/GroupCareerPage";

type AppProps = {
  career?: Career;
};

export default function App({ career }: AppProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Acesso Restrito</h2>
        <p>Este aplicativo foi desenvolvido apenas para dispositivos móveis.</p>
        <p>Por favor, acesse pelo seu celular.</p>
      </div>
    );
  }

  const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/Career/:careerId/Academy", element: <Academy /> },
    { path: "/Career/:careerId/Geral", element: <Geral /> },
    { path: "/Career/:careerId/Geral/Player/:playerId", element: <Players /> },
    {
      path: "/Career/:careerId/Season/:seasonId/Player/:playerId",
      element: <Players />,
    },

    { path: "/Career/:careerId", element: <AddSeasons /> },
    { path: "/Career/:careerId/Season/:seasonId", element: <Season /> },
    {
      path: "/CareersPage",
      element: createElement(CareersPage, { career }),
    },
    {
      path: "/CareerGroup/:groupId/Geral",
      element: <GroupCareerPage />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/Compare",
      element: <ComparePlayers />,
    },
    {
      path: "/Career/:careerId/Geral/Compare",
      element: <ComparePlayers />,
    },
    {
      path: "/Career/:careerId/Geral/Player/:playerId/Compare",
      element: <ComparePlayers />,
    },

    {
      path: "/Career/:careerId/Season/:seasonId/Match/:matchesId",
      element: <Match />,
    },

    { path: "/tutorial", element: <Tutorial /> },
  ]);

  return <RouterProvider router={router} />;
}
