import { RobotArcade } from "@acandrade/ac-bot-avatar-assets";
import type { ACBotShapeProps } from "../types";
import { ThemeShapeFrame } from "./shared";

export const ArcadeBotShape = (props: ACBotShapeProps) => {
  const fixedProps: ACBotShapeProps = {
    ...props,
    accessory: "none",
    accessoryColor: undefined,
  };

  return (
    <ThemeShapeFrame name="arcade" shapeProps={fixedProps}>
      <RobotArcade
        data-arcade-source="canonical-svg"
        data-arcade-body-color="currentColor"
      />
    </ThemeShapeFrame>
  );
};
