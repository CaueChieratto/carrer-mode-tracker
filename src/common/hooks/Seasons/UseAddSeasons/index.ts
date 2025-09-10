import { useNavigate, useParams } from "react-router-dom";
import { Career } from "../../../interfaces/Career";
import { ColorsService } from "../../../services/ColorsService";
import { ServiceSeasons } from "../../../services/ServiceSeasons";
import { useCareers } from "../../Career/UseCareer";
import { useClubColors } from "../../Colors/UseClubColors";

export const useAddSeasons = () => {
  const navigate = useNavigate();
  const { careerId } = useParams<{ careerId: string }>();
  const { loading, careers } = useCareers();

  const career = careers.find((c) => c.id === careerId);

  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(career?.id || "default") || "#ffffff"
  );

  const handleAddSeason = async (career: Career) => {
    try {
      await ServiceSeasons.addSeason(career.id);
    } catch (error) {
      console.error("Erro ao adicionar temporada:", error);
      alert("Ocorreu um erro ao adicionar a temporada.");
    }
  };

  const goBack = () => navigate("/CareersPage");

  return {
    loading,
    career,
    clubColor,
    darkClubColor,
    handleAddSeason,
    goBack,
  };
};
