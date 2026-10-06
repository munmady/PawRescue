import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Food packet (crimp-top pet-food bag with a paw label), drawn in lucide's
 * 24×24 line style so it sits alongside the other icons. Same props as a lucide icon.
 */
export function FoodPacketIcon({ size = 24, color = '#2f3a4c', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* crimped top seal */}
      <Path d="M6 3h12v3.5H6z" />
      <Path d="M9 3v3.5M12 3v3.5M15 3v3.5" strokeWidth={strokeWidth * 0.7} />
      {/* bag body, slightly flared */}
      <Path d="M6 6.5 5 19.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5L18 6.5" />
      {/* paw label */}
      <Circle cx="12" cy="15.2" r="2" />
      <Circle cx="9.6" cy="12" r="0.6" fill={color} />
      <Circle cx="11.2" cy="11" r="0.6" fill={color} />
      <Circle cx="12.8" cy="11" r="0.6" fill={color} />
      <Circle cx="14.4" cy="12" r="0.6" fill={color} />
    </Svg>
  );
}
