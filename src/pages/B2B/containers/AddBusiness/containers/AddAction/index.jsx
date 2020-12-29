import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { StoresContext } from 'store/mobx';
import GlobalIcon from 'components/common/GlobalIcon';
import { FinalForm } from 'components/forms';
import FFDatePickerSingle from 'pages/NewCampaign/containers/FFDatePickerSingle';
import { FIRSTSTEP, SECONDSTEP } from 'store/mobx/Tinder';
import { FFTextInput, FFSelect, FFTextArea } from 'components/fields';
import { ActionButton } from 'components/buttons/ActionButtons';
import { getValidatorsSecondStep } from '../validators';
import Stepper from '../Stepper';
// import PhoneView from '../PhoneView';
import styles from './styles.pcss';

const AddAction = props => {
  const { Tinder } = useContext(StoresContext);
  const { onBack } = props;
  return (
    <>
      {
        onBack &&
        <div className={styles.backContainer} onClick={() => onBack() }>
          <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
          <span className={styles.backText}>На главную страницу</span>
        </div> ||
        <Stepper />
      }
      <div className={styles.main}>
        <div className={styles.container}>
          {
            Tinder.stepUploading &&
            <Loading /> ||
            <Form onBack={onBack}/>
          }
        </div>
        <div className={styles.phoneHolder} />
      </div>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <div className={styles.header}><Skeleton width={400} height={41}/></div>
      <div className={styles.container}>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={44}/>
        </div>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={60}/>
        </div>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={44}/>
        </div>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={44}/>
        </div>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={44}/>
        </div>
        <div className={styles.btnHolder}>
          <Skeleton width={133} height={39}/>
        </div>
      </div>
    </>
  );
};

const Form = observer((props) => {
  const { Tinder } = useContext(StoresContext);
  const { onBack } = props;
  const isHeaderExist = Tinder.firstStepValues[FIRSTSTEP.NAME] || Tinder.getCurrentBusiness.name;
  console.log(Tinder.secondStepValues);
  return (
    <>
      <div className={styles.header}>
        Добавить акцию {isHeaderExist ? `для ${isHeaderExist}` : '' }
      </div>
      <div className={styles.container}>
        <FinalForm
          onSubmit={async () => {
            if (onBack) {
              await Tinder.addAction();
              return;
            }
            await Tinder.goToThirdStep();
          }}
          onChange={(values) => {
            Tinder.set('secondStepValues', values);
            if (!Tinder?.secondStepValues[SECONDSTEP.START_DATE]) {
              Tinder.set('secondStepValues', {
                ...values,
                [SECONDSTEP.END_DATE]: null,
              });
            }

            if ((Tinder?.secondStepValues[SECONDSTEP.START_DATE] &&
              Tinder?.secondStepValues[SECONDSTEP.END_DATE]) &&
              Tinder.secondStepValues[SECONDSTEP.START_DATE].isAfter(Tinder.secondStepValues[SECONDSTEP.END_DATE])
            ) {
              Tinder.set('secondStepValues', {
                ...values,
                [SECONDSTEP.END_DATE]: null,
              });
            }
          }
          }
          values={Tinder.secondStepValues}
          getValidators={getValidatorsSecondStep}
        >
          <div className={styles.inputsHolder}>
            <div className={styles.inputRow}>
              <div className={styles.labelHolder}>
                <label htmlFor={SECONDSTEP.NAME}>Название акции*</label>
              </div>

              <FFTextInput
                name={SECONDSTEP.NAME}
                // chrome doesn't work with off
                autoComplete="nope"
                className={styles.inputHolder}
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.labelHolder}>
                <label htmlFor={SECONDSTEP.ACTION_SIZE}>Размер скидки*</label>
              </div>
              <div className={styles.actionHolder}>
                <FFTextInput
                  name={SECONDSTEP.ACTION_SIZE}
                  // chrome doesn't work with off
                  autoComplete="nope"
                  className={styles.actionInput}
                  combined="right"
                />
                <FFSelect
                  options={[{ label: '₽', value: 0 }, { label: '%', value: 1 }]}
                  value="rub"
                  name={SECONDSTEP.DISCOUNT_TYPE}
                  combined="left"
                  className={styles.selectType}
                />
              </div>
            </div>

            <div className={`${styles.inputRow} ${styles.dateRow}`}>
              <div className={styles.labelHolder}>
                <label htmlFor={SECONDSTEP.START_DATE}>Срок действия</label>
              </div>
              <div className={styles.datesWrapper}>
                <div className={styles.datesHolder}>
                  <FFDatePickerSingle
                    name={SECONDSTEP.START_DATE}
                    value={Tinder?.secondStepValues[SECONDSTEP.START_DATE]}
                    noBorder
                    startDate={moment(Date.now())}
                    placeholder="С"
                    // openDirection="OPEN_UP"
                  />
                </div>
                <div className={styles.datesHolder} >
                  <FFDatePickerSingle
                    name={SECONDSTEP.END_DATE}
                    value={Tinder?.secondStepValues[SECONDSTEP.END_DATE]}
                    noBorder
                    disabled={!Tinder?.secondStepValues[SECONDSTEP.START_DATE]}
                    startDate={Tinder.secondStepValues[SECONDSTEP.START_DATE]}
                    placeholder="По"
                    // openDirection="OPEN_UP"
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.labelHolder}>
                <label htmlFor={SECONDSTEP.DESCRIPTION}>Описание акции*</label>
              </div>

              <FFTextArea
                name={SECONDSTEP.DESCRIPTION}
                rows="2"
                className={`${styles.inputHolder} ${styles.textareaDescription}`}
              />
            </div>
            <div className={styles.btnHolder}>
              {
                onBack &&
                <ActionButton iconSlug="arrowRightMinimal" type="submit" className={styles.forwardBtn}>
                  Добавить
                </ActionButton> ||
                <>
                  <div className={styles.backBtn} onClick={() => Tinder.set('introStep', 1)}>
                    &lsaquo; <span className={styles.backBtnText}>Назад</span>
                  </div>

                  <ActionButton iconSlug="arrowRightMinimal" type="submit" className={styles.forwardBtn}>
                    Следующий шаг
                  </ActionButton>
                </>
              }
            </div>
          </div>
        </FinalForm>
      </div>
    </>
  );
});

AddAction.propTypes = {
  onBack: PropTypes.any,
};

export default observer(AddAction);
