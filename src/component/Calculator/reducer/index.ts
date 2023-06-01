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
			const { display, modifier } = draft
			const currentValue = parseFloat(display) * -1
			draft.display = currentValue.toString()
			if (modifier !== 0) {
				draft.modifier = currentValue
			}
			break
		}
		case 'handlePercentage': {
			const { display } = draft
			const currentValue = parseFloat(display) * 0.01
			draft.display = currentValue.toString()
			break
		}
		case 'handleOperator': {
			const fn = action.payload
			const {
				firstValue,
				modifier,
				prevOperator,
				currOperator,
				display,
			} = draft
			const currentValue = parseFloat(display) * 1

			if (fn === prevOperator && currOperator !== OperatorType.equal) {
				if (currOperator || prevOperator === currOperator) {
					draft.currOperator = fn
					return
				}
				let calculated: number
				if (prevOperator && modifier) {
					calculated = calculate(firstValue, modifier, prevOperator)
				} else {
					calculated = calculate(
						firstValue,
						currentValue,
						prevOperator
					)
				}
				draft.firstValue = currentValue
				draft.display = calculated.toString()
				draft.result = calculated.toString()
				draft.currOperator = prevOperator
			} else {
				draft.firstValue = currentValue
				draft.currOperator = fn
			}
			draft.decimal = false
			break
		}
		case 'handleEqual': {
			const { firstValue, modifier, prevOperator, currOperator, result } =
				draft

			if (prevOperator == null) draft.prevOperator = currOperator

			if (modifier == null) draft.modifier = firstValue

			if (prevOperator && prevOperator !== OperatorType.equal) {
				const calculated = calculate(
					result ? parseFloat(result) : firstValue,
					modifier,
					prevOperator
				)
				draft.firstValue = calculated
				draft.display = calculated.toString()
				draft.result = calculated.toString()
			}
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
				draft = INITIAL_STATE
				draft.decimal = true
				draft.display = '0.'
			} else {
				if (!decimal) {
					draft.decimal = true
					draft.display = display + '.'
				}
			}
			break
		}
		default:
			throw new Error('Invalid action type')
	}
}
