import { motion } from "framer-motion";
import { EventType } from "../../types/event";
import getDate from "../utils/getDate";
import getYear from "../utils/getYear";

type Props = {
  event: EventType;
  axisLeftPosition: number;
  minHeight: number;
  firstLegislature: number;
  onClick: () => void;
};

export default function Event({
  event,
  axisLeftPosition,
  minHeight,
  firstLegislature,
  onClick
}: Props) {
  const beginDate = getDate(event.begin);
  const endDate = getDate(event.end);

  const y = (beginDate - firstLegislature) * minHeight;
  const height = Math.max((endDate - beginDate) * minHeight, minHeight);

  const fontSize = 11;
  const textX = 8;
  const textY = fontSize;

  // Check if the event is tall enough to display the title
  const isTall = height < fontSize * 2.5 ? false : true;

  const transitionDuration = 0.5;

  return (
    <motion.g
      key={event.title}
      clipPath={`url(#clip-${event.begin})`}
      initial={{
        y: y,
        opacity: "0.1"
      }}
      animate={{
        y: y,
        opacity: "1"
      }}
      transition={{ duration: transitionDuration }}
      onClick={onClick}
      className="hover:opacity-75 transition-opacity cursor-pointer"
    >
      {/* Clip */}
      <defs>
        <clipPath id={`clip-${event.begin}`}>
          <motion.rect
            x="0"
            y="-2"
            width={axisLeftPosition}
            initial={{ height: height * 1.5 }}
            animate={{ height: height * 1.5 }}
            transition={{ duration: transitionDuration }}
          />
        </clipPath>
      </defs>

      {/* Top line */}
      <line
        x1={0}
        x2={axisLeftPosition}
        y1={-1}
        y2={-1}
        stroke="currentColor"
        // strokeDasharray={"4"}
        strokeWidth={0.1}
        strokeOpacity={1}
      />

      {/* Event rectangle */}
      <motion.rect
        x={0}
        y={-1}
        width={axisLeftPosition}
        initial={{ height: height }}
        animate={{ height: height }}
        transition={{ duration: transitionDuration }}
        fill="black"
        fillOpacity={0.05}
      />

      {/* Event Date */}
      <g className="translate-x-0 sm:translate-x-5">
        <text
          x={textX}
          y={textY}
          textAnchor="left"
          fill="currentColor"
          opacity={0.5}
          fontSize={fontSize}
        >
          {getYear(endDate) !== getYear(beginDate)
            ? `${getYear(beginDate)} → ${getYear(endDate)}`
            : getYear(beginDate)}
        </text>
        {/* Event Title */}
        <motion.text
          initial={{
            x: isTall
              ? textX
              : getYear(endDate) !== getYear(beginDate)
              ? textX + fontSize * 6.5
              : textX + fontSize * 2.75,
            y: isTall ? textY + fontSize + 1 : textY
          }}
          animate={{
            x: isTall
              ? textX
              : getYear(endDate) !== getYear(beginDate)
              ? textX + fontSize * 6.5
              : textX + fontSize * 2.75,
            y: isTall ? textY + fontSize + 1 : textY
          }}
          transition={{ duration: transitionDuration }}
          textAnchor="left"
          fill="currentColor"
          fontSize={fontSize}
        >
          {event.title}
        </motion.text>
      </g>
    </motion.g>
  );
}
