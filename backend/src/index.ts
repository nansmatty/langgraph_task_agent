import express from 'express';
import cors from 'cors';
import { graphRoutes } from './routes/graphRoutes';
import { env } from './utils/env';

const app = express();
const PORT = env.PORT || 6001;

app.use(express.json());
app.use(
	cors({
		origin: env.ALLOWED_ORIGIN,
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type'],
		credentials: false,
	})
);

app.use('/agent', graphRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
