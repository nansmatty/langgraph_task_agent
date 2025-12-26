'use client';

import AgentForm from '@/components/task-agent/AgentForm';
import RunLogs from '@/components/task-agent/RunLogs';
import { approveAgentRun, startAgent } from '@/lib/api';
import { FinalView, InterruptView } from '@/lib/types';
import { useState } from 'react';

export default function Agent() {
	const [loading, setLoading] = useState(false);
	const [threadId, setThreadId] = useState<string | null>(null);
	const [interrupt, setInterrupt] = useState<InterruptView | null>(null);
	const [final, setFinal] = useState<FinalView | null>(null);

	async function handleAgentStart(input: string) {
		setLoading(true);
		setFinal(null);
		setInterrupt(null);
		setThreadId(null);

		try {
			const res = await startAgent(input);

			if (res.status === 'Error') throw new Error(res.error);
			if (res.data?.kind === 'needs_approval') {
				setThreadId(res.data.interrupt.threadId);
				setInterrupt(res.data.interrupt);
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

	async function handleOnApprove() {
		if (!threadId) return;
		setLoading(true);
		try {
			const res = await approveAgentRun(threadId, true);

			if (res.status === 'Error') throw new Error(res.error);
			if (res.data?.final) {
				setFinal(res.data.final ?? null);
				setInterrupt(null);
			} else {
				throw new Error('Unexpected response from server during approval');
			}
		} catch (error) {
			setFinal({ status: 'CANCELLED', message: (error as Error).message ?? 'Failed to approve the flow.' });
		} finally {
			setLoading(false);
		}
	}
	async function handleOnReject() {
		if (!threadId) return;
		setLoading(true);
		try {
			const res = await approveAgentRun(threadId, false);

			if (res.status === 'Error') throw new Error(res.error);
			if (res.data?.final) {
				setFinal(res.data.final ?? null);
				setInterrupt(null);
			} else {
				throw new Error('Unexpected response from server during rejection');
			}
		} catch (error) {
			setFinal({ status: 'CANCELLED', message: (error as Error).message ?? 'Failed to reject the flow.' });
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
				<RunLogs interrupt={interrupt} final={final} loading={loading} onApprove={handleOnApprove} onReject={handleOnReject} />
			</div>
		</main>
	);
}
