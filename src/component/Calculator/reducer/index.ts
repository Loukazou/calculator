import { ImmerReducer } from 'use-immer'
import { OperatorType, OperatorTypeValues } from '../Keys'
import { INITIAL_STATE } from '../constants'
import { calculate } from '../utils'
import { Action } from './action'

export type AppState = {
	modifier: number
	firstValue: number
	prevOperator: OperatorTypeValues | null
	decimal: boolean
	display: string
	result: string | null
	currOperator: OperatorTypeValues | null
}

export const reducer: ImmerReducer<AppState, Action> = (draft, action) => {
	switch (action.type) {
		case 'clearAll': {
			// Clear the current state back to the initial state
			return INITIAL_STATE
		}
		case 'clearDisplay': {
			// Clear the display value and decimal flag whenever the display is not 0
			const { currOperator, prevOperator } = draft
			draft.display = '0'
			draft.decimal = false
			// If the current operator is equal, we know that there is a result value
			// thus we need to reset firstValue, result and the current operator
			if (currOperator === OperatorType.equal) {
				draft.firstValue = 0
				draft.result = null
				draft.currOperator = null
			} else {
				/* Case: clears the current display value, either to enter a new number
				or to enter a new operator
				*/
				draft.currOperator = prevOperator
			}
			break
		}
		case 'togglePositiveNegative': {
			const { display } = draft
			const currentValue = parseFloat(display) * -1
			draft.firstValue = currentValue
			draft.display = currentValue.toString()
			draft.result = currentValue.toString()
			break
		}
		case 'handlePercentage': {
			const { display } = draft
			const currentValue = parseFloat(display) * 0.01
			draft.display = currentValue.toString()
			break
		}
		case 'handleOperator': {
			/* When one of the side operator is click */
			const fn = action.payload
			const { firstValue, prevOperator, currOperator, display } = draft

			const currentValue = parseFloat(display) * 1
			if (!currOperator && prevOperator) {
				const calculated = calculate(
					firstValue,
					currentValue,
					prevOperator
				)
				draft.firstValue = calculated
				draft.display = calculated.toString()
				draft.result = calculated.toString()
			} else {
				draft.firstValue = currentValue
			}
			draft.decimal = false
			draft.currOperator = fn
			break
		}
		case 'handleEqual': {
			/* When the handle key is click */
			const { firstValue, modifier, prevOperator, currOperator, result } =
				draft
			/*  case where the user made a calculation and presses enter again */
			if (prevOperator && prevOperator !== OperatorType.equal) {
				const calculated =
					calculate(
						result ? parseFloat(result) : firstValue,
						modifier,
						prevOperator
					) * 1
				draft.firstValue = calculated
				draft.display = calculated.toString()
				draft.result = calculated.toString()
			} else if (currOperator) {
				const calculated = calculate(
					result ? parseFloat(result) : firstValue,
					firstValue,
					currOperator
				)
				draft.modifier = firstValue
				draft.firstValue = calculated
				draft.display = calculated.toString()
				draft.result = calculated.toString()
			}

			if (prevOperator == null) draft.prevOperator = currOperator

			draft.decimal = false
			draft.currOperator = OperatorType.equal
			break
		}
		case 'handleNumber': {
			const { display, currOperator, result } = draft
			const key = action.payload

			if (display.length >= 11) return

			if (display === '0' && currOperator === null) {
				const currDisplayValue = key
				draft.display = currDisplayValue
				return
			}

			if (currOperator === null) {
				const currDisplayValue = display.concat(key)
				draft.modifier = parseFloat(currDisplayValue)
				draft.display = currDisplayValue
				return
			}

			if (currOperator !== null) {
				if (result !== null) {
					draft.firstValue = parseFloat(display)
				}
				draft.display = key
				draft.prevOperator = currOperator
				draft.currOperator = null
				draft.modifier = parseFloat(key)
			}
			break
		}
		case 'handleDecimal': {
			const { display, currOperator, decimal } = draft
			if (currOperator) {
				draft.display = '0.'
			} else if (!decimal) {
				draft.display = display + '.'
			}
			draft.decimal = true
			break
		}
		default:
			throw new Error('Invalid action type')
	}
}
