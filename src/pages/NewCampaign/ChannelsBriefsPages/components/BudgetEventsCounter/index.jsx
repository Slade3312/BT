import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from '@reach/router';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { IconPseudoLink } from 'components/buttons';

import { formatPrice } from 'utils/formatting';

import {
  getBudgetDescription,
  getBudgetErrorDescription,
  getBudgetEventsFromPrefix,
  getBudgetEventsToPrefix,
  getBudgetFixButtonText,
  getCampaignBriefsMap,
} from 'store/common/templates/newCampaign/briefs-selectors';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function BudgetEventsCounter({
  min,
  max,
  avg,
  isAudienceSmall,
  className,
  channelType,
  eventsName,
}) {
  // TODO: dispose of contextSelectors
  const template = useSelector(getCampaignBriefsMap)[channelType];

  const navigate = useNavigate();

  const description = getBudgetDescription(template);
  const errorDescription = getBudgetErrorDescription(template);
  const eventFromPrefix = getBudgetEventsFromPrefix(template);
  const eventToPrefix = getBudgetEventsToPrefix(template);
  const buttonFixText = getBudgetFixButtonText(template);

  const handlePseudoLinkClick = () => {
    navigate('../audience');
  };

  const nbsp = String.fromCharCode(160);

  return (
    <div className={cx('container', className)}>
      <span className={cx('count')}>
        {avg ? (
          `${formatPrice(avg)}`
        ) : (
          <React.Fragment>
            {min && `${eventFromPrefix}${nbsp}${formatPrice(min)}`}

            <br />

            {max && `${eventToPrefix}${nbsp}${formatPrice(max)}`}
          </React.Fragment>
        )}

        <br />

        {eventsName}
      </span>

      {isAudienceSmall ? (
        <Fragment>
          <div>
            <span className={cx('infoText')}>{errorDescription}:</span>

            <IconPseudoLink slug="" className={cx('redText')} onClick={handlePseudoLinkClick}>
              {buttonFixText}
            </IconPseudoLink>
          </div>
        </Fragment>
      ) : (
        <span className={cx('infoText')}>{description}</span>
      )}
    </div>
  );
}

BudgetEventsCounter.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  avg: PropTypes.number,
  className: PropTypes.string,
  eventsName: PropTypes.string,
  channelType: PropTypes.string,
  isAudienceSmall: PropTypes.bool,
};
