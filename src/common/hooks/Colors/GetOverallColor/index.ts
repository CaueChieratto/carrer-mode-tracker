import { ColorAssessment } from "../../../types/enums/ColorAssessment";

export const UseOverallColor = (overall: number): ColorAssessment => {
  if (overall <= 49) return ColorAssessment.Garbage;
  if (overall <= 55) return ColorAssessment.Terrible;
  if (overall <= 64) return ColorAssessment.Bad;
  if (overall <= 74) return ColorAssessment.Average;
  if (overall <= 84) return ColorAssessment.Good;
  if (overall <= 89) return ColorAssessment.Great;
  if (overall > 95) return ColorAssessment.Legendary;
  return ColorAssessment.Excellent;
};

export const UseRatingColor = (rating: number): ColorAssessment => {
  if (rating <= 5.4) return ColorAssessment.Garbage;
  if (rating <= 6) return ColorAssessment.Terrible;
  if (rating <= 6.5) return ColorAssessment.Bad;
  if (rating <= 7) return ColorAssessment.Average;
  if (rating <= 8) return ColorAssessment.Good;
  if (rating <= 8.5) return ColorAssessment.Great;
  if (rating > 9) return ColorAssessment.LegendaryMatch;
  return ColorAssessment.ExcellentMatch;
};

export const UseMatchRatingColor = (rating: number): ColorAssessment => {
  if (rating <= 5.4) return ColorAssessment.Garbage;
  if (rating <= 5.9) return ColorAssessment.Terrible;
  if (rating <= 6.4) return ColorAssessment.Bad;
  if (rating <= 7) return ColorAssessment.Average;
  if (rating <= 8) return ColorAssessment.Good;
  if (rating > 8.9) return ColorAssessment.LegendaryMatch;
  return ColorAssessment.ExcellentMatch;
};
