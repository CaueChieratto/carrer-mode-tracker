import {
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { Career } from "../../interfaces/Career";
import { Players } from "../../interfaces/playersInfo/players";
import { formatDisplayValue, parseValue } from "../../utils/FormatValue";
import { Contract } from "../../interfaces/playersInfo/contract";
import { Positions } from "../../types/Positions";
import { brasilDatePlaceholderShort, parseBrasilDate } from "../../utils/Date";
import { ClubData } from "../../interfaces/club/clubData";
import { getSeasonDateRange } from "../../utils/GetSeasonDateRange";

export const mapDocToCareer = (
  doc: QueryDocumentSnapshot<DocumentData>
): Career => {
  const data = doc.data();

  if (data.clubData && Array.isArray(data.clubData)) {
    data.clubData.forEach((season: ClubData) => {
      if (season.players && Array.isArray(season.players)) {
        season.players.forEach((player: Players) => {
          if (player.contract && Array.isArray(player.contract)) {
            player.contract.forEach((contract: Contract) => {
              if (contract.dataArrival instanceof Timestamp) {
                contract.dataArrival = contract.dataArrival.toDate();
              }
              if (contract.dataExit instanceof Timestamp) {
                contract.dataExit = contract.dataExit.toDate();
              }
            });
          }
        });
      }
    });
  }

  return {
    id: doc.id,
    ...data,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : data.createdAt,
  } as Career;
};

export const mapPlayerToFormValues = (player: Players) => {
  const latestContract = player.contract?.[0];

  const formValues = {
    playerName: player.name || "",
    overall: player.overall?.toString() || "",
    sector: player.sector || "",
    position: (player.position as string) || "",
    age: player.age?.toString() || "",
    nation: player.nation || "",
    shirtNumber: player.shirtNumber || "",
    playerValue: formatDisplayValue(player.playerValue),
    contractTime: player.contractTime?.toString() || "",
    salary: formatDisplayValue(player.salary),
    fromClub: latestContract?.fromClub || "",
    buyValue:
      player.buy && latestContract?.buyValue
        ? formatDisplayValue(latestContract.buyValue as number)
        : "",
    dateArrival: latestContract?.dataArrival
      ? brasilDatePlaceholderShort(new Date(latestContract.dataArrival))
      : "",
  };

  return formValues;
};

export const mapFormDataToPlayerData = (
  formData: FormData,
  career: Career,
  season: ClubData
): Partial<Players> => {
  const isSigning = (formData.get("isSigning") as string) === "true";
  const buyValueRaw = formData.get("buyValue") as string;
  const fromClubRaw = formData.get("fromClub") as string;
  const dateArrivalRaw = formData.get("dateArrival") as string;

  const { startDate, endDate } = getSeasonDateRange(
    season.seasonNumber,
    career.createdAt,
    career.nation
  );

  const newContract: Contract[] = [];
  if (isSigning || buyValueRaw || fromClubRaw || dateArrivalRaw) {
    const [month] = dateArrivalRaw.split("/").map(Number);
    const arrivalMonth = month - 1;

    const arrivalYear =
      arrivalMonth < startDate.getMonth()
        ? endDate.getFullYear()
        : startDate.getFullYear();

    newContract.push({
      buyValue: parseValue(buyValueRaw),
      fromClub: fromClubRaw,
      sellValue: 0,
      leftClub: "",
      dataArrival: parseBrasilDate(dateArrivalRaw, arrivalYear),
      dataExit: null,
    });
  }

  return {
    name: formData.get("playerName") as string,
    overall: Number(formData.get("overall")),
    sector: formData.get("sector") as string,
    position: formData.get("position") as keyof Positions,
    age: Number(formData.get("age")),
    nation: formData.get("nation") as string,
    shirtNumber: formData.get("shirtNumber") as string,
    playerValue: parseValue(formData.get("playerValue") as string),
    contractTime: Number(formData.get("contractTime")),
    salary: parseValue(formData.get("salary") as string),
    buy: isSigning,
    captain: (formData.get("isCaptain") as string) === "true",
    sell: false,
    ballonDor: 0,
    statsLeagues: [],
    ...(newContract.length > 0 && { contract: newContract }),
  };
};
