import { OperatorType } from './Keys'

const getDisplayFontSize = (display: string) => {
	if (7 > display.length) return '3.75rem'
	if (7 <= display.length && display.length < 8) return '3.7rem'
	if (8 <= display.length && display.length < 9) return '3.65rem'
	if (9 <= display.length && display.length < 10) return '3.6rem'
	if (10 <= display.length && display.length < 12) return '3.55rem'
	return '2.2rem'
}

/**
	 *	Take two values and operate based on the operation type
			@returns calculated value
	 */
const calculate = (
	firstValue: number,
	secondValue: number,
	operation: OperatorType
) => {
	switch (operation) {
		case OperatorType.addition:
			return firstValue + secondValue
		case OperatorType.multiply:
			return firstValue * secondValue
		case OperatorType.subtract:
			return firstValue - secondValue
		case OperatorType.divide:
			return firstValue / secondValue
		default:
			return 0
	}
}

export {
	getDisplayFontSize,
	calculate
}
