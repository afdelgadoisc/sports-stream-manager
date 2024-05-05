import { URL_API } from "@env";

export const getAllBanners = async () => {
  try {
    const response = await fetch(URL_API + "/banners");
    if (!response.ok) {
      throw new Error("Error al consultar los banners");
    }
    const data = await response.json();
    return data.banners.sort();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAllAds = async () => {
  try {
    const response = await fetch(URL_API + "/banners/ads");
    if (!response.ok) {
      console.error(response);
      throw new Error("Error consultando la publicidad existente");
    }
    const data = await response.json();
    return data.ads.sort();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getActiveAd = async () => {
  try {
    const response = await fetch(URL_API + "/banners/ads/active");
    if (!response.ok) {
      throw new Error("Error consultando la publicidad activa");
    }
    const data = await response.json();
    return data.activeAd;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const createAd = async (bannerList, nameAd) => {
  try {
    const response = await fetch(URL_API + "/banners/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "bannerList":bannerList,
        "nameGif":nameAd.trim()
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la publicidad");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

export const updateActiveAd = async (nameAd) => {
  try {
    const response = await fetch(URL_API + "/banners/ads/" + nameAd, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Error al actualizar publicidad activa");
    }
    const data = await response.json();
    return data.activeAd;
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }
}

export const deleteAd = async (id) => {
  try {
    const response = await fetch(URL_API + "/banners/ads/" + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al borrar la publicidad");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
