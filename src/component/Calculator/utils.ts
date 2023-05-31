import { Dispatch } from 'react'
import { OperatorType } from './Keys'
import { AppState } from './reducer'
import { Action } from './reducer/action'

const getDisplayFontSize = (display: string) => {
	if (7 > display.length) return '3.75rem'
	if (7 <= display.length && display.length < 8) return '3.7rem'
	if (8 <= display.length && display.length < 9) return '3.65rem'
	if (9 <= display.length && display.length < 10) return '3.6rem'
	if (10 <= display.length && display.length < 12) return '3.55rem'
	return '2.2rem'
}

/**
 * Handler for Number Key press
 */
function numberHandler(
	key: string,
	state: AppState,
	dispatch: Dispatch<Action>
): void {
	const { display, currOperator } = state
	/* Only supports 11 digit as input number */
	if (display.length >= 11) return
	/* Set the initial number when display is 0 and no selected operator */
	if (display === '0' && currOperator === null) {
		const currDisplayValue = key
		return dispatch({ type: 'setDisplay', payload: currDisplayValue })
	}
	/* append the current number with the number key if there are currently no selected operator*/
	if (currOperator === null) {
		const currDisplayValue = display.concat(key)
		dispatch({ type: 'setModifier', payload: parseFloat(currDisplayValue) })
		return dispatch({ type: 'setDisplay', payload: currDisplayValue })
	}
	/* If there are currently selected operator,
			1.	save the displayed value
			2.	save the current operator
			3. 	set the current operator data as null
			4.	get the number from the key pressed and set as a value for the next append or next calculation
			5.	display the pressed number
	*/
	if (currOperator !== null) {
		dispatch({ type: 'setFirstValue', payload: parseFloat(display) })
		dispatch({ type: 'setPrevOperator', payload: currOperator })
		dispatch({ type: 'setCurrOperator', payload: null })
		dispatch({ type: 'setModifier', payload: parseFloat(key) })
		dispatch({ type: 'setDisplay', payload: key })
	}
}

/* Reset all data back into initial */
const clearAll = (dispatch: Dispatch<Action>) => {
	return dispatch({ type: 'reset' })
}

/* Reset display value and decimal */
const clearDisplay = (dispatch: Dispatch<Action>) => {
	dispatch({ type: 'setDisplay', payload: '0' })
	dispatch({ type: 'setDecimal', payload: false })
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

/* Handler for both top and side operator key presses */
const operatorHandler = (
	fn: OperatorType,
	state: AppState,
	dispatch: Dispatch<Action>
) => {
	const { display, currOperator, firstValue, modifier, prevOperator } = state
	/* get the currently displayed value as a number */
	const currentValue = parseFloat(display) * 1
	/* AC operator block case */
	if (fn === OperatorType.allClear) {
		return clearAll(dispatch)
	}

	if (fn === OperatorType.clear) {
		return clearDisplay(dispatch)
	}

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
		/* replace the firsValue data store with the calculated result and set the current operator as the previous operator*/
		dispatch({ type: 'setFirstValue', payload: result })
		dispatch({ type: 'setDisplay', payload: result.toString() })
		dispatch({ type: 'setCurrOperator', payload: prevOperator })
	} else {
		dispatch({ type: 'setFirstValue', payload: currentValue })
		dispatch({ type: 'setCurrOperator', payload: fn })
	}
	dispatch({ type: 'setDecimal', payload: false })
}

const decimalHandler = (state: AppState, dispatch: Dispatch<Action>) => {
	const { display, currOperator, decimal } = state
	if (currOperator) {
		clearAll(dispatch)
		dispatch({ type: 'setDecimal', payload: true })
		dispatch({ type: 'setDisplay', payload: 0 + '.' })
	} else {
		if (!decimal) {
			dispatch({ type: 'setDecimal', payload: true })
			dispatch({ type: 'setDisplay', payload: display + '.' })
		}
	}
}

function handleEqualKey(state: AppState, dispatch: Dispatch<Action>) {
	const { firstValue, modifier, prevOperator, currOperator } = state
	/* Equal operator block case */
	/* Sets the current operator to the previous operator is the previous operator is null */
	if (prevOperator == null)
		dispatch({ type: 'setPrevOperator', payload: currOperator })

	/* set the stored value as the input value, if the input value is null */
	if (modifier == null) dispatch({ type: 'setModifier', payload: firstValue })
	/* if previous operator exists, calculate result from the first value, and the input value, store the result as the first value data */
	if (prevOperator && prevOperator !== OperatorType.equal) {
		const result = calculate(
			firstValue,
			modifier,
			prevOperator
		)
		dispatch({ type: 'setFirstValue', payload: result })
		dispatch({ type: 'setDisplay', payload: result.toString() })

	}
	/* edge case if input value contains a decimal but not previous operator, reset the flag */
	dispatch({ type: 'setDecimal', payload: false })
	/* equal operator is set be the current operator */
	dispatch({ type: 'setCurrOperator', payload: OperatorType.equal })
}

export {
	getDisplayFontSize,
	numberHandler,
	clearAll,
	operatorHandler,
	decimalHandler,
	handleEqualKey,
}
