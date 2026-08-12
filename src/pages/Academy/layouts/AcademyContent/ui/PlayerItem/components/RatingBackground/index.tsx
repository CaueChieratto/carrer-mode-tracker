import Styles from "./RatingBackground.module.css";

type RatingBackgroundProps = {
  rating: number;
  colorRating: string;
};

export const RatingBackground = ({
  rating,
  colorRating,
}: RatingBackgroundProps) => {
  return (
    <span className={Styles.ratingWrapper}>
      <p className={Styles.rating} style={{ backgroundColor: colorRating }}>
        {rating}
      </p>
    </span>
  );
};
