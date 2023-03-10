import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { ThemeContext } from 'contexts/themeContext'
import React, { CSSProperties, useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function MobileThemePicker() {
  const {
    themeOption,
    theme: { colors },
  } = useContext(ThemeContext)

  const size = 18
  const padding = 6
  const height = size + padding * 2
  const selectedColor = colors.icon.primary
  const unselectedColor = colors.icon.tertiary

  const iconStyleMobile: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: padding,
    paddingBottom: padding,
  }

  return (
    <div
      className="clickable-border"
      style={{
        width: size * 2 + padding * 4,
        height,
        borderRadius: height / 2,
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <div
        style={{
          ...iconStyleMobile,
          color:
            themeOption === ThemeOption.light ? selectedColor : unselectedColor,
        }}
      >
        <Sun size={size} />
      </div>
      <div
        style={{
          ...iconStyleMobile,
          color:
            themeOption === ThemeOption.dark ? selectedColor : unselectedColor,
        }}
      >
        <Moon size={size} />
      </div>
    </div>
  )
}
