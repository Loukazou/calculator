import { OperatorType, OperatorTypeValues } from '../Keys';

export type OperatorPayloadType = OperatorTypeValues | null

export type Action =
	| { type: 'clearAll' }
	| { type: 'clearDisplay' }
	| { type: 'handleEqual' }
	| { type: 'handleDecimal' }
	| { type: 'handleOperator'; payload: OperatorType }
	| { type: 'handleNumber'; payload: string }

export const clearAll = (): Action => ({ type: 'clearAll' })

export const clearDisplay = (): Action => ({
	type: 'clearDisplay',
})

export const handleOperator = (payload: OperatorType): Action => ({
	type: 'handleOperator',
	payload,
})

export const handleEqual = (): Action => ({ type: 'handleEqual' })

export const handleNumber = (payload: string): Action => ({
	type: 'handleNumber',
	payload,
})

export const handleDecimal = (): Action => ({ type: 'handleDecimal' })
