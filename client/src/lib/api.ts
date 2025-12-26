const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';

export async function startAgent(input: string) {
	try {
		const response = await fetch(`${BASE_URL}/agent/start-agent`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ input }),
		});

		if (!response.ok) {
			throw new Error(`Error starting agent: ${response.status}`);
		}

		return (await response.json()) as Promise<{
			status: 'OK' | 'Error';
			data?:
				| { kind: 'final'; final: any }
				| {
						kind: 'needs_approval';
						interrupt: {
							threadId: string;
							steps: any[];
							prompt: string;
						};
				  };
			error?: string;
		}>;
	} catch (error) {
		console.error('Error starting agent:', error);
		throw error;
	}
}

export const approveAgentRun = async (threadId: string, approve: boolean) => {
	try {
		const response = await fetch(`${BASE_URL}/agent/approve`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ threadId, approve }),
		});

		if (!response.ok) {
			throw new Error(`Error approving agent run: ${response.status}`);
		}

		return (await response.json()) as Promise<{
			status: 'OK' | 'Error';
			data?: { final: any };
			error?: string;
		}>;
	} catch (error) {
		console.error('Error approving agent run:', error);
		throw error;
	}
};
