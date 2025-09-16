import Styles from "../SeasonsPlayerTab.module.css";

type NoTitleSeasonProps = {
  leagueName: string;
};

const NoTitleSeason = ({ leagueName }: NoTitleSeasonProps) => {
  return (
    <section className={Styles.container}>
      <h1 className={Styles.leagueName_noTitle}>Não ganhou a {leagueName}</h1>
    </section>
  );
};

export default NoTitleSeason;
