const getDisplayFontSize = (display: string) => {
	if (7 > display.length) return "3.75rem"
	if (7 <= display.length && display.length < 8) return "3.7rem"
	if (8 <= display.length && display.length < 9) return "3.65rem"
	if (9 <= display.length && display.length < 10) return "3.6rem"
	if (10 <= display.length && display.length < 12)
		return "3.55rem"
	return "2.2rem"
}

export { getDisplayFontSize }
