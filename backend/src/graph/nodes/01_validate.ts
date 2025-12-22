import { State } from '../types';

export async function validateNode(state: State): Promise<Partial<State>> {
	const raw = state.input ?? '';
	const trimInput = raw.trim();

	// Here we can lot of checks and validations for input if there are any malicious patterns

	if (trimInput.length === 0) {
		return {
			status: 'CANCELLED',
			message: 'Input is empty. Please provide a valid input.',
		};
	}

	const MAX_LENGTH = 300;
	const safeInput = trimInput.length > MAX_LENGTH ? trimInput.slice(0, MAX_LENGTH) + '...' : trimInput;

	return {
		input: safeInput,
	};
}
