import React, { useState, useContext, useCallback, useEffect, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { scrollSmoothTo } from 'utils/scroll.js';
import commonStyles from 'styles/common.pcss';
import { StoresContext } from 'store/mobx';
import { wordFormByCount } from 'utils/fn';
import { TextInput } from 'components/fields/TextInput';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import FFMultiTabSelect from 'pages/NewCampaign/containers/FFMultiTabSelect';
import AddNumberButton from 'components/fields/_parts/AddNumberButton';
import { isValidUrl } from 'utils/fieldValidators';
import Heading from 'components/layouts/Heading';

import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const isSiteExists = (sitesList, site) => sitesList.length && sitesList.some(val => val === site);

function ManuallyAddedSites({ onAddedSite }) {
  const {
    Templates: { getNewCampaignTemplate },
    WebsAndPhonesTaxons,
  } = useContext(StoresContext);
  const [nodeError, setNodeError] = useState(null);
  const errorText = useCallback(
    node => {
      if (
        node !== null &&
        WebsAndPhonesTaxons.blackList?.length &&
        WebsAndPhonesTaxons.webSitesOnOfLine === 'online'
      ) {
        setNodeError(node);
      } else {
        setNodeError(null);
      }
    },
    [nodeError],
  );


  useEffect(() => {
    if (nodeError) {
      setTimeout(() => scrollSmoothTo(nodeError?.getBoundingClientRect().top), 500);
    } else {
      scrollSmoothTo(0);
    }
  }, [nodeError]);

  const {
    manuallySitesLabel,
    manuallySitesButtonText,
    manuallySitesButtonIcon,
    manuallySitesPlaceholder,
    maxCount,
    minCount,
  } = getNewCampaignTemplate('WebSitesTaxon');

  const [site, setSite] = useState('');
  const [error, setError] = useState();

  const handleChange = (value) => {
    setSite(value);
    setError('');
  };

  const addSite = () => {
    if (!site.length) {
      setError('Введите адрес сайта');
      return;
    }

    if (WebsAndPhonesTaxons.webSitesTaxon.manuallySites.length >= maxCount) {
      setError(`Максимум ${maxCount} сайтов`);
      return;
    }

    if (isSiteExists(WebsAndPhonesTaxons.webSitesTaxon.manuallySites, site)) {
      setError('Этот сайт уже добавлен');
      return;
    }

    if (!isValidUrl(site)) {
      setError('Строка не является валидным веб-адресом');
      return;
    }

    WebsAndPhonesTaxons.addManuallySites(site.toLowerCase());
    WebsAndPhonesTaxons.shouldCheckForBlackList = true;

    if (WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length >= +minCount) {
      onAddedSite();
    }

    setError('');
    setSite('');
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      addSite();
    }
  };

  const handleAddSiteClick = () => {
    addSite();
  };

  const numbersSpelling = ['адрес', 'адреса', 'адресов'];
  const websiteSpelling = ['сайт', 'сайта', 'сайтов'];

  return (
    <>
      <div className={cx('label-group-marg', 'mart-m', 'labelContainer')} ref={errorText}>
        <FormFieldLabel isBold>
          {manuallySitesLabel}
        </FormFieldLabel>

        <Heading
          level={5}
          className={cx('countLeft', { isError: WebsAndPhonesTaxons.webSitesTaxonCountLeft(+maxCount) === 0 })}
        >
          Осталось {WebsAndPhonesTaxons.webSitesTaxonCountLeft(+maxCount)} {wordFormByCount(WebsAndPhonesTaxons.webSitesTaxonCountLeft(+maxCount), numbersSpelling)}
        </Heading>
      </div>

      <div className={cx('inputContainer')}>
        <TextInput
          type="text"
          value={site}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder={manuallySitesPlaceholder}
          keepErrorIndent={false}
          error={(WebsAndPhonesTaxons.showMinWebsitesError || WebsAndPhonesTaxons.websitesTaxonCountLeftNegative < 0) ? error : ''}
        />

        <AddNumberButton
          icon={manuallySitesButtonIcon}
          onClick={handleAddSiteClick}
        >
          {manuallySitesButtonText}
        </AddNumberButton>
      </div>

      <FFMultiTabSelect
        blackList={WebsAndPhonesTaxons.blackList?.peek() || []}
        className={cx('multitabs')}
        options={WebsAndPhonesTaxons.manuallyAddedSitesList}
        name="manuallySites"
      />

      {WebsAndPhonesTaxons.showMinWebsitesError &&
        <div className={styles.error}>Для подбора аудитории необходимо указать минимум {minCount} {wordFormByCount(+minCount, numbersSpelling)} {wordFormByCount(+minCount, websiteSpelling)}.
        </div> ||
        null
      }
      {WebsAndPhonesTaxons.manuallyAddedWebSitesError &&
        <div className={styles.error}>{WebsAndPhonesTaxons.manuallyAddedWebSitesError}</div>
      }
    </>
  );
}

ManuallyAddedSites.propTypes = {
  onAddedSite: PropTypes.func,
};

export default observer(ManuallyAddedSites);
