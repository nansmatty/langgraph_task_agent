// Pause the graph and ask for user approval before proceeding.

import { State } from '../types';

export async function approveNode(state: State, context: any): Promise<Partial<State>> {
	if (state.status === 'CANCELLED') return {};

	const steps = state.steps ?? [];

	if (steps.length === 0) {
		return {
			approve: true,
			message: 'No steps available for approval.',
		};
	}

	const interrupt = (await context?.interrupt) as (payload: unknown) => Promise<unknown>;

	const decision = await interrupt({
		type: 'APPROVAL_REQUEST',
		steps,
	});

	let approve: boolean;

	// 'approve' in (desicion as any) can be written like this as well
	// Object.keys(decision as any).includes('approve') ---- but it strictly be the decision is an object
	// Object.prototype.hasOwnProperty.call(decision, 'approve') ---- this is strictly ownership check
	// Object.hasOwn(decision, 'approve') ---- this is a modern way to check ownership

	if (decision && typeof decision === 'object' && 'approve' in (decision as any)) {
		approve = Boolean((decision as any).approve);
	} else {
		approve = Boolean(decision); // this can be also written ----- !!decision
	}

	return { approve };
}
