import Styles from "./CircularProgress.module.css";

type CircularProgressProps = {
  percentage: number;
  colorClass: string;
};

export const CircularProgress = ({
  percentage,
  colorClass,
}: CircularProgressProps) => {
  const radius = 22;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={Styles.circular_wrapper}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#f0f0f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${Styles.circle_progress} ${colorClass}`}
        />
      </svg>

      <span className={Styles.circular_text}>{percentage}%</span>
    </div>
  );
};
