import { ChatOpenAI } from '@langchain/openai';
import z from 'zod';
import { env } from '../../utils/env';
import { State } from '../types';

const NotesSchema = z.object({
	notes: z.array(z.string().min(1).max(500)).min(1).max(20),
});

export type Notes = z.infer<typeof NotesSchema>;

function makeModel() {
	return new ChatOpenAI({
		apiKey: env.OPENAI_API_KEY,
		modelName: env.OPENAI_MODEL,
		temperature: 0.2,
	});
}

function createHumanPrompt(steps: string[]) {
	const stepList = JSON.stringify(steps, null, 0);

	return [
		'You are concise assistant.',
		'Given a list of steps, return a JSON object {"notes": string[]}',
		'Rules: ',
		'notes.length must be equal to steps.length',
		'Each note should be a brief summary of the corresponding step.',
		'Each note must be between 20 and 300 characters.',
		'Plain text only, no markdown or special formatting.',
		`Steps=${stepList}`,
	].join('\n');
}

export async function executeNode(state: State): Promise<Partial<State>> {
	// In the video, instructor called it guardrails
	if (!state.approved) return {};
	const steps = state.steps ?? [];
	if (steps.length === 0) return {};

	const model = makeModel();

	const structuredOutput = model.withStructuredOutput<Notes>(NotesSchema);

	const out: Notes = await structuredOutput.invoke([
		{
			role: 'system',
			content: 'Return only valid JSON that matches the schema.',
		},
		{
			role: 'human',
			content: createHumanPrompt(steps),
		},
	]);

	const count = Math.min(out.notes.length, steps.length);
	const result = Array.from({ length: count }, (_, i) => ({
		step: steps[i],
		note: out.notes[i],
	}));

	return { result, status: 'DONE', message: `Executed ${result.length} step(s).` };
}
