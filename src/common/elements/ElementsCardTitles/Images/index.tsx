import Styles from "./Images.module.css";

type ImagesProps = {
  trophyImage: string;
};

export const Images = ({ trophyImage }: ImagesProps) => {
  return <img className={Styles.img} src={trophyImage} />;
};
