// Define and compile the langgraph workflow

import { Annotation, Command, END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
import { validateNode } from './nodes/01_validate';
import { planNode } from './nodes/02_plan';
import { approvedNode } from './nodes/03_approved';
import { executeNode } from './nodes/04_execute';
import { finalizeNode } from './nodes/05_finalize';
import { makeInitialState, State } from './types';

const StateAnn = Annotation.Root({
	input: Annotation<string>,
	steps: Annotation<string[] | undefined>,
	approved: Annotation<boolean | undefined>,
	result: Annotation<Array<{ step: string; note: string }> | undefined>,
	status: Annotation<'PLANNED' | 'DONE' | 'CANCELLED' | undefined>,
	message: Annotation<string | undefined>,
});

const checkpointer = new MemorySaver();

const builder = new StateGraph(StateAnn)
	.addNode('validate', validateNode)
	.addNode('plan', planNode)
	.addNode('approved', approvedNode)
	.addNode('execute', executeNode)
	.addNode('finalize', finalizeNode);

builder.addEdge(START, 'validate');
builder.addEdge('validate', 'plan');
builder.addEdge('plan', 'approved');

//Conditional edge based on approval
builder.addConditionalEdges('approved', (s: typeof StateAnn.State) => {
	return s.approved ? 'execute' : 'finalize';
});

builder.addEdge('execute', 'finalize');
builder.addEdge('finalize', END);

const graph = builder.compile({ checkpointer });

function createThreadId() {
	return `langraph_task_agent_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function startAgentRun(input: string): Promise<{ interrupt: { threadId: string; steps: string[] } } | { final: State }> {
	const threadId = createThreadId();

	const config = { configurable: { thread_id: threadId } };

	const result: any = await graph.invoke(makeInitialState(input), config);

	if (result && result.__interrupt__) {
		const first = Array.isArray(result.__interrupt__) ? result.__interrupt__[0] : result.__interrupt__;
		const steps = (first?.value?.steps as string[]) ?? [];

		return { interrupt: { threadId, steps } };
	}
	return {
		final: result as State,
	};
}

export async function resumeAgentRun(args: { threadId: string; approved: boolean }): Promise<State> {
	const { threadId, approved } = args;

	const config = { configurable: { thread_id: threadId } };
	const finalState = await graph.invoke(new Command({ resume: { approved } }), config);

	return finalState as State;
}
