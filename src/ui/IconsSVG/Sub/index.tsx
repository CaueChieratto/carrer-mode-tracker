type SubProps = {
  className: string;
};

export const Sub = ({ className }: SubProps) => {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" className={className}>
      <g clipPath="url(#clip0_7324_19939)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.25 3.45V5.25H9L11.25 3L9 0.75H8.25V2.55"
          fill="#A4A9B3"
        ></path>
        <path
          d="M3.5625 5.25H2.4375V2.4375H8.25V3.5625H3.5625V5.25Z"
          fill="#A4A9B3"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.75 8.55V6.75H3L0.75 9L3 11.25H3.75V9.45"
          fill="#c7361f"
        ></path>
        <path
          d="M9.5625 9.5625H3.75V8.4375H8.4375V6.75H9.5625V9.5625Z"
          fill="#c7361f"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_7324_19939">
          <rect
            width="10.5"
            height="10.5"
            fill="white"
            transform="translate(0.75 0.75)"
          ></rect>
        </clipPath>
      </defs>
    </svg>
  );
};
