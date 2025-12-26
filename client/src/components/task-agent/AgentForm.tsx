'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Sparkles } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const AgentForm = ({ onStart, disabled }: { onStart: (input: string) => void; disabled: boolean }) => {
	const [text, setText] = useState('');

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-2xl font-bold text-cyan-700'>
					<Sparkles className='h-6 w-6 text-cyan-700' />
					Task Agent
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Textarea
					placeholder='Example: "Plan a 1-week fitness routine with diet recommendation'
					value={text}
					onChange={(event) => setText(event.target.value)}
					className='resize-none border-border/50'
					rows={5}
				/>
				<div className='flex gap-3'>
					<Button
						className={`flex-1 bg-cyan-700 ${disabled ? 'cursor-not-allowed' : 'hover:bg-cyan-800 cursor-pointer'}`}
						size='lg'
						onClick={() => text.trim() && onStart(text.trim())}
						disabled={disabled || text.trim().length === 0}>
						Run Agent
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AgentForm;
