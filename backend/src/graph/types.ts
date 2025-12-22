// define the state that flows through the LangGraph

import { z } from 'zod';

export const ExecutionState = z.enum(['PLANNED', 'DONE', 'CANCELLED']);
export type ExecutionState = z.infer<typeof ExecutionState>;

export const StepResult = z.object({
	step: z.string(),
	note: z.string(),
});

export const StateSchema = z.object({
	input: z.string().min(5, 'Input is required'),
	steps: z.array(z.string()).optional(),
	approved: z.boolean().optional(),
	result: z.array(StepResult).optional(),
	status: ExecutionState.optional(),
	message: z.string().optional(),
});

export type State = z.infer<typeof StateSchema>;

//intiaL state helper
export function makeInitialState(input: string): State {
	return {
		input,
		status: 'PLANNED',
	};
}
