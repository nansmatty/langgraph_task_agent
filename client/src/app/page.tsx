'use client';

import AgentForm from '@/components/task-agent/AgentForm';
import RunLogs from '@/components/task-agent/RunLogs';
import { startAgent } from '@/lib/api';
import { FinalView, InterruptView } from '@/lib/types';
import { useState } from 'react';

export default function Agent() {
	const [loading, setLoading] = useState(false);
	const [threadId, setThreadId] = useState<string | null>(null);
	const [interuppt, setInteruppt] = useState<InterruptView | null>(null);
	const [final, setFinal] = useState<FinalView | null>(null);

	async function handleAgentStart(input: string) {
		setLoading(true);
		setFinal(null);
		setInteruppt(null);
		setThreadId(null);

		try {
			const res = await startAgent(input);

			if (res.status === 'Error') throw new Error(res.error);
			if (res.data?.kind === 'needs_approval') {
				setThreadId(res.data.interrupt.threadId);
				setInteruppt(res.data.interrupt);
			} else if (res.data?.kind === 'final') {
				setFinal(res.data.final);
			} else {
				throw new Error('Unexpected response from server');
			}
		} catch (error) {
			setFinal({ status: 'CANCELLED', message: (error as Error).message ?? 'Failed to start agent run.' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className='min-h-screen'>
			<div className='max-w-5xl mx-auto space-y-6 py-8'>
				<div className='text-center mb-8 space-y-2'>
					<h1 className='text-4xl font-bold text-cyan-700'>LangGraph Task Agent</h1>
					<p className='text-muted-foreground font-semibold text-lg'>AI-Powered task planning and execution with human-in-the-loop</p>
				</div>
				<AgentForm onStart={handleAgentStart} disabled={loading} />
				<RunLogs />
			</div>
		</main>
	);
}
