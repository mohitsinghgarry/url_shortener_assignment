import { Router } from 'express';
import { shortenUrl, redirectUrl, getUrlStats, getAnalytics } from '../controllers/urlController';

const router = Router();

router.post('/api/shorten', shortenUrl);
router.get('/:code', redirectUrl);
router.get('/:code/stats', getUrlStats);
router.get('/api/:code/analytics', getAnalytics);

export default router;