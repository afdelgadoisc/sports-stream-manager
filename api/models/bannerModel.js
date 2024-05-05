import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const GIFEncoder = require('gifencoder');

export class BannerModel {
  static async getAll() {
    const banners = await axios.get(process.env.URL_WORKER_AD + '/banners', {
      headers: {
        'X-Custom-Auth-Key': process.env.AUTH_WORKER,
      },
    });
    return banners.data;
  }

  static async getAllAds() {
    const banners = await axios.get(process.env.URL_WORKER_AD + '/ads', {
      headers: {
        'X-Custom-Auth-Key': process.env.AUTH_WORKER,
      },
    });
    return banners.data;
  }

  static async getActiveAd() {
    const banners = await axios.get(process.env.URL_WORKER_AD + '/ads/active', {
      headers: {
        'X-Custom-Auth-Key': process.env.AUTH_WORKER,
      },
    });
    return banners.data;
  }

  static async activateAd({ id }) {
    const banners = await axios.put(
      process.env.URL_WORKER_AD + '/ads/' + id,
      {},
      {
        headers: {
          'X-Custom-Auth-Key': process.env.AUTH_WORKER,
        },
      }
    );
    return banners.data;
  }

  static async deactivateAd({ id }) {
    const banners = await axios.delete(
      process.env.URL_WORKER_AD + '/ads/' + id,
      {
        headers: {
          'X-Custom-Auth-Key': process.env.AUTH_WORKER,
        },
      }
    );
    return banners.data;
  }

  static async createGif({ bannerList, nameGif }) {
    console.log('createGif');
    const encoder = new GIFEncoder(728, 90); // Define el tamaño del GIF
    encoder.start();
    encoder.setRepeat(0); // Loop infinitely
    encoder.setDelay(8000); // 500 ms between frames
    encoder.setQuality(10); // Image quality

    const canvas = createCanvas(728, 90);
    const ctx = canvas.getContext('2d');
    for (const banner of bannerList) {
      const imageResponse = await axios({
        method: 'get',
        url: process.env.URL_WORKER_AD + '/banners?bannerList=' + banner,
        responseType: 'arraybuffer',
        headers: {
          'X-Custom-Auth-Key': process.env.AUTH_WORKER,
        },
      });
      const imgBuffer = Buffer.from(imageResponse.data, 'binary');
      const img = await loadImage(imgBuffer);
      ctx.drawImage(img, 0, 0, 728, 90);
      encoder.addFrame(ctx);
    }
    encoder.finish();
    const buffer = encoder.out.getData();
    const responsePost = await axios.post(
      process.env.URL_WORKER_AD + '/ads/' + nameGif + '.gif',
      buffer,
      {
        headers: {
          'X-Custom-Auth-Key': process.env.AUTH_WORKER,
          'Content-Type': 'image/gif',
        },
      }
    );
    console.log('GIF creado');
    return responsePost.data;
  }
}
