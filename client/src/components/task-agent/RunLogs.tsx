'use client';

import { AlertCircle, Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FinalView, InterruptView } from '@/lib/types';
import { Button } from '../ui/button';

const RunLogs = ({
	interrupt,
	final,
	loading,
	onApprove,
	onReject,
}: {
	interrupt?: InterruptView | null;
	final?: FinalView | null;
	loading: boolean;
	onApprove?: () => void;
	onReject?: () => void;
}) => {
	if (loading) {
		return (
			<Card className='mt-5 border-primary/20'>
				<CardContent className='flex items-center justify-center py-12'>
					<div className='text-center space-y-3'>
						<Loader2 className='h-8 w-8 animate-spin text-primary mx-auto' />
						<p className='text-2xl font-bold text-muted-foreground'>Agent is processing your request...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (interrupt) {
		return (
			<Card className='mt-5 border-primary/20'>
				<div className='p-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-2xl'>
							<AlertCircle className='h-5 w-5 text-yellow-500' />
							Approval Required
						</CardTitle>
						<CardDescription className='text-base font-semibold px-3'>{interrupt.prompt}</CardDescription>
					</CardHeader>
					<CardContent className='space-y-5 mt-5'>
						<div className='space-y-3'>
							<h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>Planned Steps</h4>
							<ol className='space-y-2 pl-6 list-decimal'>
								{interrupt.steps.map((step, index) => (
									<li key={`${step}-${index}`} className='text-foreground leading-relaxed'>
										{step}
									</li>
								))}
							</ol>
							<div className='mt-6 flex gap-3'>
								<Button onClick={onApprove} className='flex-1'>
									<ThumbsUp className='mr-2 h-4 w-4' />
									Approve & Continue
								</Button>
								<Button onClick={onReject} variant='outline' className='flex-1 border-destructive/40'>
									<ThumbsDown className='mr-2 h-4 w-4' />
									Reject Plan
								</Button>
							</div>
						</div>
					</CardContent>
				</div>
			</Card>
		);
	}

	return (
		<Card className='mt-6 border-dashed'>
			<CardContent className='flex items-center justify-center py-12'>
				<div className='text-center space-y-2'>
					<Sparkles className='mx-auto mb-3 h-10 w-10 text-muted-foreground' />
					<p className='text-2xl font-bold text-muted-foreground'>No active run, Start the agent above to begin.</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default RunLogs;
