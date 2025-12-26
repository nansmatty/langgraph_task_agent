'use client';

import AgentForm from '@/components/task-agent/AgentForm';
import RunLogs from '@/components/task-agent/RunLogs';
import { FinalView, InterruptView } from '@/lib/types';
import { useState } from 'react';

export default function Agent() {
	const [loading, setLoading] = useState(false);
	const [threadId, setThreadId] = useState<string | null>(null);
	const [interuppt, setInteruppt] = useState<InterruptView | null>(null);
	const [final, setFinal] = useState<FinalView | null>(null);

	return (
		<main className='min-h-screen'>
			<div className='max-w-5xl mx-auto space-y-6 py-8'>
				<div className='text-center mb-8 space-y-2'>
					<h1 className='text-4xl font-bold text-cyan-700'>LangGraph Task Agent</h1>
					<p className='text-muted-foreground font-semibold text-lg'>AI-Powered task planning and execution with human-in-the-loop</p>
				</div>
				<AgentForm />
				<RunLogs />
			</div>
		</main>
	);
}
