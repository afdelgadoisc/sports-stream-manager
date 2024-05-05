import express, { json } from 'express';
import { createMatchRouter } from './routes/matches.js';
import { createBannerRouter } from './routes/banners.js';
import { corsMiddleware } from './middlewares/cors.js';
import 'dotenv/config';
import { MatchModel } from './models/matchModel.js';
import { BannerModel } from './models/bannerModel.js';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/banners', createBannerRouter({ bannerModel: BannerModel }));
app.use('/matches', createMatchRouter({ matchModel: MatchModel }));

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

export default app;
