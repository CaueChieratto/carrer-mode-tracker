export interface Contract {
  buyValue: number | string;
  sellValue: number;
  fromClub: string;
  leftClub: string;
  dataArrival: Date | null;
  dataExit?: Date | null;
  isLoan?: boolean;
  loanDuration?: number;
  wagePercentage?: number;
  buyOptionValue?: number;
  fullSalary?: number;
}
