import React, { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useFieldArray } from 'react-final-form-arrays';
import { StoresContext } from 'store/mobx';
import withFieldArray from 'enhancers/withFieldArray';
import LightText from 'components/common/LightText';

import GeoTypeSelect from './components/GeoTypeSelect';
import { SUGGEST_INPUT_ID, GEO_STATUS_OPTIONS } from './constants';
import AddressesList from './components/AddressesList';
import AddressField from './components/AddressField';
import AddressesHeader from './components/AddressesHeader';
import AddressesListContainer from './components/AddressesListContainer';
import { getAddress, getCity, getPoint, initMapControls } from './utils';
import ActualMap from './components/ActualMap';
import PlaceMark from './assets/point.cur';

function GeoTaxonsBlock({ withoutGeoType, mapAdvice }) {
  const { Templates: { getNewCampaignTemplate } } = useContext(StoresContext);
  const geoExactAddressTemplates = getNewCampaignTemplate('StepAudienceContent')?.geoExactAddress;
  const geoTypeHeaders = getNewCampaignTemplate('StepAudienceContent')?.geoType;

  const noActiveFieldIndex = null;

  const [currentMapPoint] = useState([55.75244051150325, 37.62113070898438]);
  const [map, setMap] = useState();
  const [isCheckModeActive, setIsCheckModeActive] = useState(false);
  const [randomId] = useState(String(Math.random()).split('.')[1]);
  const [suggester, setSuggester] = useState();
  const [ymaps] = useState(window.ymaps);
  const [activeFieldIndex, setActiveFieldIndex] = useState(noActiveFieldIndex);

  const [addressInputValue, setAddressInputValue] = useState();
  const [addressRadiusValue, setAddressRadiusValue] = useState(1000);
  const [addressInputError, setAddressInputError] = useState();
  const [addressListError, setAddressListError] = useState();

  const { fields } = useFieldArray('geo_points');

  const mapState = {
    center: currentMapPoint,
    zoom: 10,
    controls: [],
  };

  const handleAddressChange = ({ val, index }) => {
    setAddressInputError('');
    setAddressInputValue(val);
    setActiveFieldIndex(index);
  };

  const handleRadiusChange = ({ val, index }) => {
    setAddressRadiusValue(val);
    setActiveFieldIndex(index);
  };

  const initPointAndPlaceMark = (lat, lng, radius = 1000) => {
    const placeMark = new ymaps.Placemark([lat, lng], {}, {
      iconLayout: 'default#image',
      iconImageClipRect: [[0, 0], [27, 27]],
      iconImageHref: PlaceMark,
      iconImageSize: [25, 25],
      iconImageOffset: [-11, -20],
    });

    const circle = new ymaps.GeoObject({
      geometry: {
        type: 'Circle',
        coordinates: [lat, lng],
        radius,
      },
    }, {
      fillColor: '#fbcd5677',
      strokeColor: '#fbcd56',
      strokeOpacity: 0.8,
      strokeWidth: 1,
    });

    map.geoObjects.add(placeMark);
    map.geoObjects.add(circle);
  };

  const handleAddAddressClick = useCallback(() => {
    ymaps.geocode(addressInputValue, {
      json: true,
    }).then((res) => {
      const city = getCity(res);
      const coords = getPoint(res);

      map.setCenter([coords[0], coords[1]]);

      initPointAndPlaceMark(coords[0], coords[1], addressRadiusValue);

      fields.push({
        lat: coords[0],
        lng: coords[1],
        radius: addressRadiusValue,
        city,
        address: addressInputValue,
      });

      setAddressInputError('');
      setAddressInputValue('');
      setAddressRadiusValue(1000);
    }).catch((err) => {
      console.error(err);
      setAddressInputError('Адреса не существует');
    });
  }, [addressInputValue, addressRadiusValue]);

  const handleAddressEdit = ({ newValue, newRadius, index }) => {
    if (newValue) {
      ymaps.geocode(newValue, {
        json: true,
      }).then((res) => {
        const city = getCity(res);
        const coords = getPoint(res);

        map.setCenter([coords[0], coords[1]]);

        initPointAndPlaceMark(coords[0], coords[1]);

        fields.update(index, {
          lat: coords[0],
          lng: coords[1],
          radius: newRadius || 1000,
          city,
          address: newValue,
        });

        setAddressListError('');
      }).catch((err) => {
        console.error(err);
        setAddressListError('Адреса не существует');
      });
    }
    if (newRadius) {
      fields.update(index, { ...fields.value[index], radius: newRadius });
    }
  };

  const handleAddressSelect = (e) => {
    setAddressInputValue(e.get('item').value);
  };

  const handleAddressClick = (index) => {
    const { lat, lng } = fields.value[index];
    map.setCenter([lat, lng]);
  };

  const handleRemoveAllClick = () => {
    map.geoObjects.removeAll();
    fields.forEach(() => {
      fields.pop();
    });

    setActiveFieldIndex(noActiveFieldIndex);
  };

  const handleMapClick = (e) => {
    if (!isCheckModeActive) {
      return;
    }
    const coords = e.get('coords');

    ymaps.geocode(coords, {
      json: true,
    }).then((res) => {
      const city = getCity(res);
      const pointAddress = getAddress(res);

      initPointAndPlaceMark(coords[0], coords[1]);

      fields.push({
        lat: coords[0],
        lng: coords[1],
        radius: 1000,
        city,
        address: !city || city === pointAddress ? pointAddress : `${city}, ${getAddress(res)}`,
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleRemoveAddressClick = (pointName) => {
    fields.remove(pointName);
    setActiveFieldIndex(noActiveFieldIndex);
  };

  const handleActiveFieldIndexChange = (newActiveFieldIndex) => {
    setActiveFieldIndex(newActiveFieldIndex);
  };

  const initMap = () => {
    fields.forEach((name, index) => {
      const { lat, lng, radius } = fields.value[index];
      initPointAndPlaceMark(lat, lng, radius);
    });
  };

  useEffect(() => {
    if (ymaps && ymaps.Map && !map) {
      setMap(new ymaps.Map(randomId, mapState, {
        suppressMapOpenBlock: true,
      }));
    }

    if (map) {
      initMap();
      initMapControls(map, randomId);
      const suggestView = new ymaps.SuggestView(SUGGEST_INPUT_ID + randomId);
      setSuggester(suggestView);
      suggestView.events.add('select', handleAddressSelect);
      map.cursors.push('inherit');
    }

    return () => {
      if (map) {
        map.destroy();
        setMap(undefined);
      }
      if (suggester) {
        suggester.events.remove('select', handleAddressSelect);
      }
    };
  }, [map]);

  useEffect(() => {
    if (map) {
      map.events.add('click', handleMapClick);
    }

    return () => {
      if (map) {
        map.events.remove('click', handleMapClick);
      }
    };
  }, [isCheckModeActive]);

  useEffect(() => {
    if (map) {
      map.geoObjects.removeAll();
      initMap();
    }
  }, [fields]);

  useEffect(() => {
    try {
      if (fields?.value?.length && map) {
        map.panTo([
          fields.value[fields.value.length - 1].lat,
          fields.value[fields.value.length - 1].lng,
        ], { useMapMargin: true });
      }
    } catch (e) {
      console.log(e);
    }
  }, [map]);

  return (
    <div>
      <AddressField
        templatesData={geoExactAddressTemplates}
        error={addressInputError}
        value={addressInputValue}
        radiusValue={addressRadiusValue}
        activeFieldIndex={activeFieldIndex}
        onAddressChange={handleAddressChange}
        onRadiusChange={handleRadiusChange}
        onAddAddressClick={handleAddAddressClick}
        id={randomId}
        index={-1}
      />

      <LightText>
        {mapAdvice || 'Или отметьте булавкой на карте'}
      </LightText>

      <ActualMap
        randomId={randomId}
        isCheckModeActive={isCheckModeActive}
        setIsCheckModeActive={setIsCheckModeActive}
      />

      <AddressesListContainer>
        {!!fields.value && !!fields.value.length && (
          <React.Fragment>
            <AddressesHeader
              addressesCount={fields.value && fields.value.length}
              onClick={handleRemoveAllClick}
            />

            <AddressesList
              map={map}
              activeFieldIndex={activeFieldIndex}
              fieldError={addressListError}
              fields={fields}
              geoStatusOptions={GEO_STATUS_OPTIONS}
              onAddressChange={handleAddressEdit}
              onAddressClick={handleAddressClick}
              onRemoveAddressClick={handleRemoveAddressClick}
              onActiveFieldIndexChange={handleActiveFieldIndexChange}
            />
          </React.Fragment>
        )}
      </AddressesListContainer>

      {!withoutGeoType && <GeoTypeSelect geoStatusOptions={GEO_STATUS_OPTIONS} geoHeaders={geoTypeHeaders} />}
    </div>
  );
}

GeoTaxonsBlock.propTypes = {
  withoutGeoType: PropTypes.bool,
  mapAdvice: PropTypes.string,
};

export default observer(withFieldArray(GeoTaxonsBlock));
