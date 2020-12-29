import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { StoresContext } from 'store/mobx';
// import GlobalIcon from 'components/common/GlobalIcon';
import styles from './styles.pcss';

const ActionsList = () => {
  const { Tinder } = useContext(StoresContext);
  return (
    <>
      <div>
        <div
          className={styles.addButton}
          onClick={() => Tinder.set('showModalAddAction', true)}
        >+ Добавить новую акцию</div>
      </div>
      <div>
        {
          Tinder.getCurrentBusiness?.actions?.map(action => {
            return (
              <div className={styles.listItem} key={action.id}>
                <div>
                  <div className={styles.title}>{action.name}</div>
                  <div className={styles.descriptionText}>{action.description}</div>
                  <div className={styles.description}>с {moment(action.date_start).format('DD.MM.YYYY')} до {moment(action.date_end).format('DD.MM.YYYY')}</div>
                </div>
                {/* <GlobalIcon slug="deleteIcon" /> */}
              </div>
            );
          })
        }
      </div>
    </>
  );
};

export default observer(ActionsList);
