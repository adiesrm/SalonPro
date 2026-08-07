import { Platform } from 'react-native';

import { colors } from './colors';
import { spacing } from './spacing';

export { colors, spacing };

export const theme = {
  colors,
  spacing,
  radius: {
    sm: 14,
    md: 18,
    lg: 28,
    pill: 999,
  },
  typography: {
    displayFont: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  shadows: {
    glass: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.18,
      shadowRadius: 28,
      elevation: 8,
    },
    button: {
      shadowColor: colors.cocoa,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.24,
      shadowRadius: 18,
      elevation: 6,
    },
  },
};
