import { Router } from 'express';
import { BannerController } from '../controllers/bannerController.js';

export const createBannerRouter = ({ bannerModel }) => {
  const bannerRouter = Router();
  const bannerController = new BannerController({ bannerModel });
  bannerRouter.get('/', bannerController.getAll);
  bannerRouter.get('/ads', bannerController.getAllAds);
  bannerRouter.get('/ads/active', bannerController.getActiveAd);
  bannerRouter.put('/ads/:id', bannerController.activateAd);
  bannerRouter.delete('/ads/:id', bannerController.deactivateAd);
  bannerRouter.post('/ads', bannerController.createGif);

  return bannerRouter;
};
