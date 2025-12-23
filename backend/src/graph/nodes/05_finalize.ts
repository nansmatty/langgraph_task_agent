import { State } from '../types';

export async function finalizeNode(state: State): Promise<Partial<State>> {
	const approved = state.approved ?? false;
	const result = state.result ?? [];
	const steps = state.steps ?? [];
	const currentStatus = state.status;

	let status: State['status'];

	if (currentStatus === 'CANCELLED' || approved === false) {
		status = 'CANCELLED';
	} else {
		status = 'DONE';
	}

	let message: string;
	if (status === 'CANCELLED') {
		message = state.message ?? (steps.length ? 'User rejected the plan. Nothing to execute.' : 'Cancelled before execution.');
	} else {
		message =
			state.message ??
			(steps.length
				? `Task completed successfully with ${result.length} result(s).`
				: steps.length
				? 'Plan is approved but there were no steps to execute.'
				: 'Finshed successfully with no steps to execute.');
	}

	return {
		status,
		message,
		steps,
		result,
	};
}
