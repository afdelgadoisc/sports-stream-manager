export class BannerController {
  constructor({ bannerModel }) {
    this.bannerModel = bannerModel;
  }

  getAll = async (req, res) => {
    const banners = await this.bannerModel.getAll();
    if (banners.banners.length === 0) {
      return res.status(404).json({ message: 'Banners not found' });
    }
    res.json(banners);
  };

  getAllAds = async (req, res) => {
    const ads = await this.bannerModel.getAllAds();
    if (ads.ads.length === 0) {
      return res.status(404).json({ message: 'Ads not found' });
    }
    res.json(ads);
  };

  getActiveAd = async (req, res) => {
    const activeAd = await this.bannerModel.getActiveAd();
    if (activeAd.length === 0) {
      return res.status(404).json({ message: 'Active ad not found' });
    }
    res.json(activeAd);
  };

  activateAd = async (req, res) => {
    const { id } = req.params;
    const response = await this.bannerModel.activateAd({ id });
    res.json(response);
  };

  deactivateAd = async (req, res) => {
    const { id } = req.params;
    const response = await this.bannerModel.deactivateAd({ id });
    res.json(response);
  };

  createGif = async (req, res) => {
    const { bannerList, nameGif } = req.body;
    const response = await this.bannerModel.createGif({
      bannerList: bannerList,
      nameGif: nameGif,
    });
    res.status(201).json(response);
  };
}
