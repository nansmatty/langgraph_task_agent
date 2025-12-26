export type InterruptView = {
	threadId: string;
	steps: string[];
	prompt: string;
};

export type FinalView = {
	status: 'PLANNED' | 'DONE' | 'CANCELLED';
	message?: string;
	steps?: string[];
	result?: { step: string; note: string }[];
};
