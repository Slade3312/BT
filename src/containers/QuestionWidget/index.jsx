import React, { useEffect, useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { useParams } from '@reach/router';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import PureButton from 'components/buttons/PureButton';
import AskCreateCampaign from 'components/modals/AskCreateCampaign';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function QuestionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  const { Common, Templates } = useContext(StoresContext);
  const { isAskCreateCampaignVisible } = Common;
  const { text } = Templates.getCommonTemplate('QuestionWidget');
  const params = useParams();

  useEffect(() => {
    const openTimerId = setTimeout(() => setIsOpen(true), 30000);
    const closeTimerId = setTimeout(() => setIsOpen(false), 40000);

    const animationTimerId = setInterval(() => setIsAnimated(prev => !prev), 5000);

    return () => {
      clearTimeout(openTimerId);
      clearTimeout(closeTimerId);
      clearInterval(animationTimerId);
    };
  }, []);

  return null;

  // eslint-disable-next-line no-unreachable
  return (
    <>
      <PureButton
        name="question-widget"
        className={cx('container', { opened: isOpen, animated: isAnimated })}
        onClick={() => Common.set('isAskCreateCampaignVisible', true)}
      >
        <GlobalIcon slug="roundQuestion" className={styles.icon} />

        <span className={styles.text}>{text}</span>
      </PureButton>

      {isAskCreateCampaignVisible && <AskCreateCampaign campaignId={params.campaignId} />}
    </>
  );
}

export default observer(QuestionWidget);
