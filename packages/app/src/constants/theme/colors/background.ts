import { juiceColors } from 'constants/styles/colors'
import { SemanticColors } from 'models/semantic-theme/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    l0: juiceColors.white,
    l1: juiceColors.white,
    l2: juiceColors.white,
    disabled: juiceColors.white,
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.ctaHint,
      highlight: juiceColors.ctaHighlight,
    },
  },
  [ThemeOption.dark]: {
    l0: juiceColors.dark0,
    l1: juiceColors.dark1,
    l2: juiceColors.dark2,
    disabled: juiceColors.dark2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.ctaHint,
      highlight: juiceColors.ctaHighlight,
    },
  },
}
