import { Router } from 'express';
import { z } from 'zod';
import { resumeAgentRun, startAgentRun } from '../graph/graph';

export const graphRoutes = Router();

// Define a schema for the request body
const StartAgentSchema = z.object({
	input: z.string().min(1, 'Input is required'),
});

const ApproveSchema = z.object({
	threadId: z.string().min(1, 'Thread ID is required'),
	approve: z.boolean(),
});

// POST /start-agent
graphRoutes.post('/start-agent', async (req, res) => {
	const parsed = StartAgentSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ status: 'Error', error: 'Error while parsing input' });
	}

	try {
		const result = await startAgentRun(parsed.data.input);

		if ('final' in result) {
			return res.status(200).json({ status: 'OK', data: { kind: 'final', final: result.final } });
		}

		if ('interrupt' in result) {
			return res.status(200).json({
				status: 'OK',
				data: {
					kind: 'needs_approval',
					interrupt: {
						threadId: result.interrupt.threadId,
						steps: result.interrupt.steps,
						prompt: 'Approve the generated plan to execute or reject it.',
					},
				},
			});
		}

		return res.status(500).json({ status: 'Error', error: 'Unexpected result from agent run' });
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /approve
graphRoutes.post('/approve', async (req, res) => {
	const parsed = ApproveSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ status: 'Error', error: 'Error while parsing approval input' });
	}

	try {
		const { threadId, approve } = parsed.data;
		const finalState = await resumeAgentRun({ threadId, approved: approve });
		return res.status(200).json({ status: 'OK', data: { final: finalState } });
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error during approval processing' });
	}
});
