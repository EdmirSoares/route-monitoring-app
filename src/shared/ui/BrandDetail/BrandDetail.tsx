import Svg, { Line } from "react-native-svg";
import { useNetworkStatus } from "@/src/shared/lib/useNetworkStatus";
import { useTheme } from "@/src/shared/lib/useTheme";

type BrandDetailProps = {
  size?: number;
  connected?: boolean;
};

export function BrandDetail({ size = 106, connected: connectedProp }: BrandDetailProps) {
  const { isConnected } = useNetworkStatus();
  const theme = useTheme();
  const isActive = connectedProp ?? isConnected;

  const pValues = [108, 119, 130, 141, 152, 163, 174, 185];
  const INACTIVE_BARS = 3;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {pValues.map((p, i) => {
        const x1 = p - 100;
        const x2 = 100;
        const y2 = p - 100;

        let stroke: string;
        if (!isActive) {
          stroke = theme.colors.status.error;
        } else if (i < INACTIVE_BARS) {
          stroke = theme.colors.text.white;
        } else {
          stroke = theme.colors.primary.default;
        }

        return (
          <Line
            key={p}
            x1={x1}
            y1={100}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={1}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}
