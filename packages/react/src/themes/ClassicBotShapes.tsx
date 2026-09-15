import { accessories as defaultAccessories } from "@acandrade/ac-bot-avatar-assets";
import { ACBotShape } from "../ACBotShape";
import type { ACBotShapeProps, AvatarPartComponent } from "../types";

const ROBOT_ACCESSORY_TRANSFORM = "translate(0, 36)";

export const RobotShape = ({
  accessory = "none",
  accessoryColor,
  accessoryRegistry = defaultAccessories,
  ...props
}: ACBotShapeProps) => {
  const Accessory = accessoryRegistry[accessory] as
    | AvatarPartComponent
    | undefined;

  return (
    <g data-ac-bot-theme-shell="robot">
      <ACBotShape
        {...props}
        variant="robot"
        accessory="none"
        accessoryColor={undefined}
      />
      {accessory !== "none" && Accessory ? (
        <g className="ac-bot-accessory" transform={ROBOT_ACCESSORY_TRANSFORM}>
          <Accessory style={{ color: accessoryColor ?? "#000000" }} />
        </g>
      ) : null}
    </g>
  );
};

export const FaceMinimalShape = (props: ACBotShapeProps) => (
  <g data-ac-bot-theme-shell="face-minimal">
    <ACBotShape
      {...props}
      variant="face"
      accessory="none"
      accessoryColor={undefined}
    />
  </g>
);
