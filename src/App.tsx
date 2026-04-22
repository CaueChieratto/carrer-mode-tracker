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
import Tutorial from "./pages/Tutorial";
import { AddMatches } from "./pages/AddMatches";
import { Match } from "./pages/Match";
import { AddStatsMatch } from "./pages/AddStatsMatch";
import { AddDetails } from "./pages/AddDetails";
import { AddMatchStatsPlayer } from "./pages/AddMatchStatsPlayer";
import { useIsMobile } from "./common/hooks/useIsMobile";

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
    {
      path: "/Career/:careerId/Season/:seasonId/AddMatches",
      element: <AddMatches />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/AddMatches/:matchesId",
      element: <AddMatches />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/Match/:matchesId",
      element: <Match />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/Match/:matchesId/AddStatsMatch",
      element: <AddStatsMatch />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/Match/:matchesId/AddDetails",
      element: <AddDetails />,
    },
    {
      path: "/Career/:careerId/Season/:seasonId/Match/:matchesId/:playerId",
      element: <AddMatchStatsPlayer />,
    },
    { path: "/tutorial", element: <Tutorial /> },
  ]);

  return <RouterProvider router={router} />;
}
