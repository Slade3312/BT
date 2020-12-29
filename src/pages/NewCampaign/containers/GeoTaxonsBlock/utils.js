import { zoomControlsString } from './data';

// init for custom ZOOM buttons
export const initMapControls = (mapRef, id) => {
  const ZoomLayout = window.ymaps.templateLayoutFactory.createClass(
    zoomControlsString(id),
    {
      build() {
        ZoomLayout.superclass.build.call(this);

        this.zoomInCallback = this.zoomIn.bind(this);
        this.zoomOutCallback = this.zoomOut.bind(this);

        const zoomIn = document.getElementById(`zoom-in-${id}`);
        const zoomOut = document.getElementById(`zoom-out-${id}`);

        if (zoomIn && zoomOut) {
          zoomIn.addEventListener('click', this.zoomInCallback);
          zoomOut.addEventListener('click', this.zoomOutCallback);
        }
      },

      clear() {
        const zoomIn = document.getElementById(`zoom-in-${id}`);
        const zoomOut = document.getElementById(`zoom-out-${id}`);

        if (zoomIn && zoomOut) {
          zoomIn.removeEventListener('click', this.zoomInCallback);
          zoomOut.removeEventListener('click', this.zoomOutCallback);
        }

        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
      },

      zoomOut() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
      },
    },
  );

  const zoomControl = new window.ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });

  mapRef.controls.add(zoomControl, { float: 'none', size: 'small', position: { right: '15px', top: '20px' } });
};

export const getGeoObject = (res) => {
  if (res.GeoObjectCollection.featureMember[0]) {
    return res.GeoObjectCollection.featureMember[0].GeoObject;
  }
  return {};
};

export const getAddress = res => getGeoObject(res).name;

export const getCity = (res) => {
  const metaArray = getGeoObject(res).metaDataProperty.GeocoderMetaData.Address.Components;
  const locality = metaArray.find(item => item.kind === 'locality');

  if (locality) {
    return locality.name;
  }

  let province;

  for (let i = metaArray.length - 1; i >= 0; i -= 1) {
    if (metaArray[i].kind === 'province') {
      province = metaArray[i].name;
      break;
    }
  }
  return province;
};

export const getPoint = (res) => {
  if (getGeoObject(res).Point) {
    return getGeoObject(res).Point.pos.split(' ').reverse().map(item => Number(item));
  }
  return null;
};
