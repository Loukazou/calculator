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
			return INITIAL_STATE
		}
		case 'clearDisplay': {
			const { currOperator, prevOperator } = draft
			draft.display = '0'
			draft.decimal = false
			if (currOperator === OperatorType.equal) {
				draft.firstValue = 0
				draft.result = null
				draft.currOperator = null
			} else {
				draft.currOperator = prevOperator
			}
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

			/*	handles case of cumulative operator calculation,
			if the currently pressed operator is the same as the previous operator AND the current operator is not set to Equal operator.
			else save the displayed value as the result and set the current operator to the invoked operator
	      */
			if (fn === prevOperator && currOperator !== OperatorType.equal) {
				let result: number
				/* if there is a previous operator and a modifier (saved input value) */
				if (prevOperator && modifier) {
					result = calculate(firstValue, modifier, prevOperator)
				} else {
					/* use the currently displayed value as the second value */
					result = calculate(firstValue, currentValue, prevOperator)
				}
				/* replace the firsValue data store with the calculated result and set the current operator as the previous operator */
				draft.firstValue = currentValue
				draft.display = result.toString()
				draft.currOperator = prevOperator
			} else {
				draft.firstValue = currentValue
				draft.currOperator = fn
			}
			draft.decimal = false
			break
		}
		case 'handleEqual': {
			const { firstValue, modifier, prevOperator, currOperator } = draft
			/* Equal operator block case */
			/* Sets the current operator to the previous operator is the previous operator is null */
			if (prevOperator == null) draft.prevOperator = currOperator

			/* set the stored value as the input value, if the input value is null */
			if (modifier == null) draft.modifier = firstValue
			/* if previous operator exists, calculate result from the first value, and the input value, store the result as the first value data */
			if (prevOperator && prevOperator !== OperatorType.equal) {
				const result = calculate(firstValue, modifier, prevOperator)
				draft.firstValue = result
				draft.display = result.toString()
				draft.result = result.toString()
			}
			/* edge case if input value contains a decimal but not previous operator, reset the flag */
			draft.decimal = false
			/* equal operator is set be the current operator */
			draft.currOperator = OperatorType.equal
			break
		}
		case 'handleNumber': {
			const { display, currOperator, result } = draft
			const key = action.payload
			if (display.length >= 11) return
			/* Set the initial number when display is 0 and no selected operator */
			if (display === '0' && currOperator === null) {
				const currDisplayValue = key
				draft.display = currDisplayValue
				return
			}
			/* append the current number with the number key if there are currently no selected operator*/
			if (currOperator === null) {
				const currDisplayValue = display.concat(key)
				draft.modifier = parseFloat(currDisplayValue)
				draft.display = currDisplayValue
				return
			}

			/* If there are currently selected operator,
			1.	save the displayed value
			2.	save the current operator
			3. 	set the current operator data as null
			4.	get the number from the key pressed and set as a value for the next append or next calculation
			5.	display the pressed number */
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
