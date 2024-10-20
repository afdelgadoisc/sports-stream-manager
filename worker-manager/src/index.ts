/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	MY_BUCKET: R2Bucket;
	AUTH_KEY_SECRET: string;
}

const hasValidHeader = (request: Request, env: Env) => {
	return request.headers.get('X-Custom-Auth-Key') === env.AUTH_KEY_SECRET;
};

async function uploadGif(request: Request, env: Env, nombreGif: string) {
	try {
		const data = await request.arrayBuffer();

		await env.MY_BUCKET.put(nombreGif, data, {
			httpMetadata: {
				contentType: 'image/gif',
			},
		});
		return new Response(JSON.stringify({ message: 'GIF uploaded successfully' }), { status: 200 });
	} catch (error) {
		console.error('Error uploading GIF:', error);
		return new Response(JSON.stringify({ error: 'Error uploading GIF' }), { status: 500 });
	}
}

async function getBannersList(env: Env) {
	let listBannerKeys: string[] = [];
	const banners: R2Objects = await env.MY_BUCKET.list();
	for (const banner of banners.objects) {
		console.log(banner.key);
		const extension = banner.key.split('.').pop();
		if (extension !== 'gif') {
			listBannerKeys.push(banner.key);
		}
	}
	return listBannerKeys;
}

async function getAdsList(env: Env) {
	let listAdsKeys: string[] = [];
	const ads: R2Objects = await env.MY_BUCKET.list();
	for (const ad of ads.objects) {
		const extension = ad.key.split('.').pop();
		if (extension === 'gif' && ad.key !== 'publi.gif') {
			listAdsKeys.push(ad.key);
		}
	}
	return listAdsKeys;
}

async function getAdsActive(env: Env) {
	let adActive = '';
	const ads: R2Objects = await env.MY_BUCKET.list();
	const adBase: R2Object | undefined = ads.objects.find((ad) => ad.key === 'publi.gif');
	for (const ad of ads.objects) {
		if (ad.key !== adBase?.key) {
			const extension = ad.key.split('.').pop();
			if (extension === 'gif') {
				if (ad.etag === adBase?.etag) {
					return ad.key;
				}
			}
		}
	}
	return adActive;
}

async function activateAd(env: Env, newAdKey: string) {
	const newAd: R2ObjectBody | null = await env.MY_BUCKET.get(newAdKey);
	if (newAd) {
		await env.MY_BUCKET.put('publi.gif', await newAd?.blob(), {
			httpMetadata: {
				contentType: 'image/gif',
			},
		});
		return newAdKey;
	}
	return '';
}

async function blobToBase64(blob : Blob) {
	const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/gif;base64,${btoa(binary)}`;
}

async function getBannerHTML(bannersGif: R2ObjectBody, isMobile: boolean) {
	// Obtener el blob del GIF
	const gifBlob = await bannersGif.blob();

	// Convertir el Blob a Base64 para incrustar en HTML
	const base64Data = await blobToBase64(gifBlob);
	let html = '';
	// Crear HTML con el GIF incrustado
	if (isMobile) {
		html = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Publicidad</title>
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				body, html {
					width: 100%;
					height: 100%;
				}
			</style>
		</head>
		<body>
			<div>
				<img src="${base64Data}" alt="Publicidad" style="width: 100%;">
			</div>
		</body>
		</html>
	`;
	} else {
		html = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>Publicidad</title>
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				body, html {
					width: 100%;
					height: 100%;
				}
			</style>
		</head>
		<body>
			<div>
				<img src="${base64Data}" alt="Publicidad">
			</div>
		</body>
		</html>
	`;
	}
	return html;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url: URL = new URL(request.url);
		const pathSegments = url.pathname.split('/').filter((p) => p);
		if (!hasValidHeader(request, env) && url.pathname !== '/publicidad' && url.pathname !== '/publicidad-movil') {
			return new Response('401 Unauthorized', { status: 401 });
		}
		switch (request.method) {
			case 'GET':
				if (url.pathname === '/publicidad') {
					const bannersGif: R2ObjectBody | null = await env.MY_BUCKET.get('publi.gif');
					if (!bannersGif) {
						return new Response('404 Not Found', { status: 404 });
					}
					const html = await getBannerHTML(bannersGif, false);
					return new Response(html, {
						status: 200,
						headers: {
							'Content-Type': 'text/html',
						},
					});
				}
				if (url.pathname === '/publicidad-movil') {
					const bannersGif: R2ObjectBody | null = await env.MY_BUCKET.get('publi.gif');
					if (!bannersGif) {
						return new Response('404 Not Found', { status: 404 });
					}
					const html = await getBannerHTML(bannersGif,true);
					return new Response(html, {
						status: 200,
						headers: {
							'Content-Type': 'text/html',
						},
					});
				}
				if (url.pathname === '/banners' && !url.searchParams.has('bannerList')) {
					const listBannerKeys = await getBannersList(env);
					return new Response(JSON.stringify({ banners: listBannerKeys }), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				}
				if (url.pathname === '/banners' && url.searchParams.has('bannerList')) {
					const bannerList: string[] = url.searchParams.get('bannerList')?.split(',') || [];
					for (const bannerKey of bannerList) {
						const banner: R2ObjectBody | null = await env.MY_BUCKET.get(bannerKey);
						if (banner) {
							return new Response(await banner.arrayBuffer(), {
								status: 200,
							});
						}
					}
				}
				if (url.pathname === '/ads') {
					const listAdsKeys = await getAdsList(env);
					return new Response(JSON.stringify({ ads: listAdsKeys }), {
						status: 200,
						headers: {
							'Content-Type': 'application/json',
						},
					});
				}
				if (url.pathname === '/ads/active') {
					const adActive = await getAdsActive(env);
					return new Response(JSON.stringify({ activeAd: adActive }), {
						status: 200,
					});
				}
			case 'POST':
				if (pathSegments[0] === 'ads' && pathSegments.length === 2) {
					const nombreGif = pathSegments[1];
					return uploadGif(request, env, nombreGif);
				}
			case 'PUT':
				if (pathSegments[0] === 'ads' && pathSegments.length === 2) {
					const nombreGif = pathSegments[1];
					const adActive = await activateAd(env, nombreGif);
					return new Response(JSON.stringify({ activeAd: adActive }), {
						status: 200,
					});
				}
			case 'DELETE':
				if (pathSegments[0] === 'ads' && pathSegments.length === 2) {
					const nombreGif = pathSegments[1];
					await env.MY_BUCKET.delete(nombreGif);
					return new Response(JSON.stringify({ message: 'GIF deleted successfully' }), { status: 200 });
				}
		}
		return new Response('404 Not Found', { status: 404 });
	},
};
