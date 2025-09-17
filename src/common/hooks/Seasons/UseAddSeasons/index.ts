import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Career } from "../../../interfaces/Career";
import { ColorsService } from "../../../services/ColorsService";
import { ServiceSeasons } from "../../../services/ServiceSeasons";
import { useCareers } from "../../Career/UseCareer";
import { useClubColors } from "../../Colors/UseClubColors";

export const useAddSeasons = () => {
  const navigate = useNavigate();
  const { careerId } = useParams<{ careerId: string }>();
  const { loading: loadingCareers, careers } = useCareers();

  const [loading, setLoading] = useState(false);

  const career = careers.find((c) => c.id === careerId);

  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(career?.id || "default") || "#ffffff"
  );

  const handleAddSeason = async (career: Career) => {
    try {
      setLoading(true);
      await ServiceSeasons.addSeason(career.id);
    } catch (error) {
      console.error("Erro ao adicionar temporada:", error);
      alert("Ocorreu um erro ao adicionar a temporada.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/CareersPage");

  return {
    loading: loading || loadingCareers,
    career,
    clubColor,
    darkClubColor,
    handleAddSeason,
    goBack,
  };
};
