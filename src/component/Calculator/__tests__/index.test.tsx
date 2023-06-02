import {
	render,
	screen,
	userEvent,
} from "../../../utils/test-utils"
import { keys } from "../Keys"
import Calculator from "../index"

type ariaLabel = typeof keys[number]["ariaLabel"] | 'clear'

const pressKey = async (key: ariaLabel) => {
	const keyNumber = screen.getByRole("button", {
		name: new RegExp(key, "i"),
	})
	return await userEvent.click(keyNumber)
}

const pressKeys = async (...keys: ariaLabel[]) => {
	for (const key of keys) {
		await pressKey(key)
	}
}

const clear = async () => {
	await pressKey("clear")
}

interface Tests {
	message: string
	keys: ariaLabel[]
	result: string
}

const tests: Tests[] = [
	{
		message: "Number key",
		keys: ["2"],
		result: "2",
	},
	{
		message: "Number Number",
		keys: ["3", "5"],
		result: "35",
	},
	{
		message: "Number Decimal",
		keys: ["4", "decimal"],
		result: "4.",
	},
	{
		message: "Number Decimal Number",
		keys: ["4", "decimal", "5"],
		result: "4.5",
	},
	{
		message: "Addition",
		keys: ["2", "addition", "5", "equal"],
		result: "7",
	},
	{
		message: "Subtraction",
		keys: ["5", "subtraction", "9", "equal"],
		result: "-4",
	},
	{
		message: "Multiplication",
		keys: ["4", "multiplication", "8", "equal"],
		result: "32",
	},
	{
		message: "Division",
		keys: ["5", "division", "1", "0", "equal"],
		result: "0.5",
	},
	{
		message: "Number Equal",
		keys: ["5", "equal"],
		result: "5",
	},
	{
		message: "Number Decimal Equal",
		keys: ["2", "decimal", "4", "5", "equal"],
		result: "2.45",
	},
	{
		message: "Decimal key",
		keys: ["decimal"],
		result: "0.",
	},
	{
		message: "Decimal Decimal",
		keys: ["2", "decimal", "decimal"],
		result: "2.",
	},
	{
		message: "Decimal Number Decimal",
		keys: ["2", "decimal", "5", "decimal", "5"],
		result: "2.55",
	},
	{
		message: "Decimal Equal",
		keys: ["2", "decimal", "equal"],
		result: "2.",
	},
	{
		message: "Equal",
		keys: ["equal"],
		result: "0",
	},
	{
		message: "Equal Number",
		keys: ["equal", "3"],
		result: "3",
	},
	{
		message: "Number Equal Number",
		keys: ["5", "equal", "3"],
		result: "3",
	},
	{
		message: "Equal Decimal",
		keys: ["equal", "decimal"],
		result: "0.",
	},
	{
		message: "Number Equal Decimal",
		keys: ["5", "equal", "decimal"],
		result: "0.",
	},
	{
		message: "Calculation + Operator",
		keys: [
			"1",
			"addition",
			"1",
			"equal",
			"addition",
			"1",
			"equal",
		],
		result: "3",
	},
	{
		message: "Operator Decimal",
		keys: ["multiplication", "decimal"],
		result: "0.",
	},
	{
		message: "Number Operator Decimal",
		keys: ["5", "multiplication", "decimal"],
		result: "0.",
	},
	{
		message: "Number Operator Equal",
		keys: ["7", "division", "equal"],
		result: "1",
	},
	{
		message: "Operator calculation",
		keys: ["9", "subtraction", "5", "subtraction"],
		result: "4",
	},
	{
		message: "Number Operator Operator",
		keys: ["9", "multiplication", "division"],
		result: "9",
	},
	{
		message: "Number Operator Equal Equal",
		keys: ["9", "subtraction", "equal", "equal"],
		result: "-9",
	},
	{
		message: "Number Operator Number Equal Equal",
		keys: ["8", "subtraction", "5", "equal", "equal"],
		result: "-2",
	},
	{
		message: "Operator follow-up calculation",
		keys: [
			"1",
			"addition",
			"2",
			"addition",
			"3",
			"addition",
			"4",
			"addition",
			"5",
			"addition",
		],
		result: "15",
	},
]

describe("Calculator component test", () => {
	for (const { message, keys, result } of tests) {
		it(message, async () => {
			render(<Calculator />)
			const resultDisplay = screen.getByRole("textbox", {
				name: /result/i,
			})
			await pressKeys(...keys).then(() =>
				expect(resultDisplay).toHaveDisplayValue(result),
			)
			await clear()
		})
	}
})
