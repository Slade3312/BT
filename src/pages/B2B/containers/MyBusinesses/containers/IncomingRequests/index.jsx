import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import { ActionButton } from 'components/buttons';
import styles from './styles.pcss';


const IncomingRequests = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <div className={styles.container}>
      <div
        className={styles.backContainer}
        onClick={() => Tinder.goBackToRequests()}
      >
        <div className={styles.backIconHolder}>
          <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
          <span className={styles.backText}>Назад</span>
        </div>
        <div><span className={styles.backText}>{moment(Tinder.getCurrentPartner.created_date).format('DD mm YYYY г.')}</span></div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.listIcon} style={{
          background: `url(${Tinder.getCurrentPartner.from_business.industry_icon})`,
          backgroundSize: 'contain',
        }} />
        <div className={styles.itemName}>{Tinder.getCurrentPartner.from_business.name}</div>
      </div>
      <div className={styles.saleName}>{Tinder.getCurrentPartner.from_action.name}</div>
      <div className={styles.saleDescription}>{Tinder.getCurrentPartner.from_action.description}</div>
      <div className={styles.date}>с {moment(Tinder.getCurrentPartner.from_action.date_start).format('DD.MM.YYYY')} до {moment(Tinder.getCurrentPartner.from_action.date_end).format('DD.MM.YYYY')}</div>

      <div className={styles.line}>
        <GlobalIcon slug="handshakeSmallGrey" className={styles.handshakeIcon} />
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.listIcon} style={{
          background: `url(${Tinder.getCurrentPartner.to_business.industry_icon})`,
          backgroundSize: 'contain',
        }} />
        <div className={styles.itemName}>{Tinder.getCurrentPartner.to_business.name}</div>
      </div>
      <div className={styles.saleName}>{Tinder.getCurrentPartner.to_action.name}</div>
      <div className={styles.saleDescription}>{Tinder.getCurrentPartner.to_action.description}</div>
      <div className={styles.date}>с {moment(Tinder.getCurrentPartner.to_action.date_start).format('DD.MM.YYYY')} до {moment(Tinder.getCurrentPartner.to_action.date_end).format('DD.MM.YYYY')}</div>
      <div className={styles.btnHolder}>
        <ActionButton
          className={styles.accept}
          onClick={() => Tinder.makeDecision(true)}
        >
          Принять
        </ActionButton>
        <ActionButton
          className={styles.reject}
          onClick={() => Tinder.makeDecision(false)}
        >
          Отклонить
        </ActionButton>
      </div>

    </div>
  );
};

export default observer(IncomingRequests);
