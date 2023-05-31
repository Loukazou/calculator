import { OperatorTypeValues } from '../Keys';

export type Action =
	| { type: 'setDisplay'; payload: string }
	| { type: 'setModifier'; payload: number }
	| { type: 'setFirstValue'; payload: number }
	| { type: 'setDecimal'; payload: boolean }
	| { type: 'setPrevOperator'; payload: OperatorTypeValues | null }
	| { type: 'setCurrOperator'; payload: OperatorTypeValues | null }
	| { type: 'reset' }
