import React, { useContext, Fragment } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import IconChooser from '../../../../components/common/IconChooser';
import styles from './styles.pcss';


const ChooseYourAction = () => {
  const { Tinder } = useContext(StoresContext);
  if (!Tinder.approvedBusinessList.length) return (<NoApprovedBusinesses />);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Выберите акцию, которую хотите предложить взамен</div>
      <GlobalIcon slug="handshake" className={styles.handshake}/>
      <div>

        {
          Tinder.approvedBusinessList.map(business => {
            if (!business?.actions?.length) return null;
            return (
              <Fragment key={business.id}>
                <div className={styles.businessName} key={business.id}>{business.name}</div>
                <div className={styles.companyHolder}>
                  {
                    business?.actions.map(action => {
                      return (
                        <div
                          className={styles.card}
                          onClick={() => Tinder.becomePartners({ businessId: business.id, actionId: action.id })}
                          key={action.id}
                        >
                          <div>
                            <div className={styles.cardTitle}>
                              {action.name}
                            </div>
                            <div className={styles.dates}>
                              с {action.date_start} до {action.date_end}
                            </div>
                          </div>
                          <GlobalIcon slug="iconLeftList" />
                        </div>
                      );
                    })
                  }
                </div>
              </Fragment>
            );
          })
        }
      </div>
    </div>
  );
};

// const Loader = () => {
//   return (
//     <div>
//       <div className={styles.businessName}><Skeleton width={250} /></div>
//       <div className={styles.companyHolder}>
//         <Skeleton width={324} height={88}/>
//         <Skeleton width={324} height={88}/>
//       </div>

//       <div className={styles.businessName}><Skeleton width={250} /></div>
//       <div className={styles.companyHolder}>
//         <Skeleton width={324} height={88}/>
//         <Skeleton width={324} height={88}/>
//       </div>
//     </div>
//   );
// };

const NoApprovedBusinesses = () => {
  return (
    <div className={styles.responseContainer}>
      <div className={styles.failFace}>
        <IconChooser type={IconChooser.propConstants.types.fail} />
      </div>
      <div className={styles.text}>
        У вас нет бизнесов<br/>прошедших модерацию
      </div>
    </div>
  );
};
export default observer(ChooseYourAction);
