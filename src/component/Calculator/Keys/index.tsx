
export enum keyType {
	topOperator = 'topOperator',
	sideOperator = 'sideOperator',
	number = 'number',
	zero = 'zero',
	decimal = 'decimal',
}

export enum OperatorType {
	allClear = 'all clear',
	clear = 'clear',
	togglePlusMinus = 'toggle plus minus',
	decimal = 'decimal',
	percentage = 'percentage',
	divide = 'divide',
	multiply = 'multiply',
	subtract = 'subtract',
	addition = 'addition',
	equal = 'equal',
}

export type OperatorTypeValues = typeof OperatorType[keyof typeof OperatorType];

export const keys = [
	{
		key: 'AC',
		type: keyType.topOperator,
		function: OperatorType.allClear,
		ariaLabel: 'all clear',
	},
	{
		key: <>&plusmn;</>,
		type: keyType.topOperator,
		function: OperatorType.togglePlusMinus,
		ariaLabel: 'toggle plus minus',
	},
	{
		key: <>&#37;</>,
		type: keyType.topOperator,
		function: OperatorType.percentage,
		ariaLabel: 'toggle percentage',
	},
	{
		key: <>&divide;</>,
		type: keyType.sideOperator,
		function: OperatorType.divide,
		ariaLabel: 'division',
	},
	{
		key: '7',
		type: keyType.number,
		function: null,
		ariaLabel: '7',
	},
	{
		key: '8',
		type: keyType.number,
		function: null,
		ariaLabel: '8',
	},
	{
		key: '9',
		type: keyType.number,
		function: null,
		ariaLabel: '9',
	},
	{
		key: <>&times;</>,
		type: keyType.sideOperator,
		function: OperatorType.multiply,
		ariaLabel: 'multiplication',
	},
	{
		key: '4',
		type: keyType.number,
		function: null,
		ariaLabel: '4',
	},
	{
		key: '5',
		type: keyType.number,
		function: null,
		ariaLabel: '5',
	},
	{
		key: '6',
		type: keyType.number,
		function: null,
		ariaLabel: '6',
	},
	{
		key: <>&minus;</>,
		type: keyType.sideOperator,
		function: OperatorType.subtract,
		ariaLabel: 'subtraction',
	},
	{
		key: '1',
		type: keyType.number,
		function: null,
		ariaLabel: '1',
	},
	{
		key: '2',
		type: keyType.number,
		function: null,
		ariaLabel: '2',
	},
	{
		key: '3',
		type: keyType.number,
		function: null,
		ariaLabel: '3',
	},
	{
		key: <>&#43;</>,
		type: keyType.sideOperator,
		function: OperatorType.addition,
		ariaLabel: 'addition',
	},
	{
		key: '0',
		type: keyType.zero,
		function: OperatorType.togglePlusMinus,
		ariaLabel: '0',
	},
	{
		key: '.',
		type: keyType.decimal,
		function: OperatorType.togglePlusMinus,
		ariaLabel: 'decimal',
	},
	{
		key: <>&#61;</>,
		type: keyType.sideOperator,
		function: OperatorType.equal,
		ariaLabel: 'equal',
	},
] as const
