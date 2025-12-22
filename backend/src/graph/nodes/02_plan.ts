import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { env } from '../../utils/env';
import { State } from '../types';

const PlanSchema = z.object({
	steps: z.array(z.string().min(3, 'Keep each step a short sentence').max(150, 'Keep each step concise')).min(1).max(10),
});

type Plan = z.infer<typeof PlanSchema>;

function makeModel() {
	return new ChatOpenAI({
		apiKey: env.OPENAI_API_KEY,
		modelName: env.OPENAI_MODEL,
		temperature: 0.2,
	});
}

const SYSTEM_PROMPT = [
	'You are an expert helpful planner',
	'Return only JSON that matches the schema',
	'Keep steps concrete, actionable and beginner friendly.',
].join('\n');

function userPrompt(input: string) {
	return [`User goal: ${input}`, 'Draft a small plan with 3-5 steps.', '- Each step should be a short, clear sentence.'].join('\n');
}

function takeFirstN(arr: string[], n: 5): string[] {
	return Array.isArray(arr) ? arr.slice(0, Math.max(0, n)) : [];
}

export async function planNode(state: State): Promise<Partial<State>> {
	if (state.status === 'CANCELLED') return {};
	const model = makeModel();

	const structuredOutput = model.withStructuredOutput<Plan>(PlanSchema);

	const plan = await structuredOutput.invoke([
		{
			role: 'system',
			content: SYSTEM_PROMPT,
		},
		{
			role: 'human',
			content: userPrompt(state.input),
		},
	]);

	const steps = takeFirstN(plan.steps, 5);

	return { steps, status: 'PLANNED' };
}
