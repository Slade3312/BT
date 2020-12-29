import React, { useContext, useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { StoresContext } from 'store/mobx';
import { FinalForm } from 'components/forms';
import GlobalIcon from 'components/common/GlobalIcon';
import { formatPhoneProxy, normalizePhone } from 'utils/formatting';
import { FFTextInput, FFSelect, FFPhoneInput, FFTextArea } from 'components/fields';
import { ActionButton } from 'components/buttons/ActionButtons';
import TextInput from 'components/fields/TextInput/components/TextInput';
import { FIRSTSTEP } from 'store/mobx/Tinder';
import { getValidatorsFirstStep } from '../validators';
import Stepper from '../Stepper';
import styles from './styles.pcss';

const SUGGEST_INPUT_ID = 'suggest';
const randomId = Date.now();

const AddBusiness = observer((props) => {
  const { Common, Tinder } = useContext(StoresContext);
  useEffect(() => {
    Common.getIndustries();
  }, []);
  return (
    <>
      {
        props.onBack &&
        <div className={styles.backContainer} onClick={() => props.onBack() }>
          <GlobalIcon slug="backSmallArrow" className={styles.backIcon}/>
          <span className={styles.backText}>На главную страницу</span>
        </div> ||
        <Stepper />
      }

      {
        !Common.industries.length &&
        !Tinder.stepUploading &&
        <Loading /> ||
        null
      }

      {
        Common.industries.length &&
        !Tinder.stepUploading &&
        <Form onBack={props.onBack}/> ||
        null
      }

      {
        Tinder.stepUploading &&
        <UploadingStep /> ||
        null
      }
    </>
  );
});

AddBusiness.propTypes = {
  onBack: PropTypes.any,
};

const UploadingStep = () => {
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
        <div className={styles.btnHolder}>
          <div className={styles.backBtn} iconSlugBefore="arrowRightMinimal">
            <Skeleton width={122} height={17}/>
          </div>
          <Skeleton width={200} height={39}/>
        </div>
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
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={44}/>
        </div>
        <div className={styles.skeletonContainer}>
          <Skeleton width={122} height={17}/>
          <Skeleton width={276} height={60}/>
        </div>
        <div className={styles.btnHolder}>
          <div className={styles.backBtn} iconSlugBefore="arrowRightMinimal">
            <Skeleton width={122} height={17}/>
          </div>
          <Skeleton width={200} height={39}/>
        </div>
      </div>
    </>
  );
};

const Form = observer((props) => {
  const { Tinder, Common } = useContext(StoresContext);
  const { onBack } = props;
  return (
    <div className={styles.contentHolder}>
      <div>
        <div className={styles.header}>{onBack ? 'Добавить новый бизнес' : 'Добавить первый бизнес'}</div>
        <div className={styles.container}>
          <FinalForm
            onSubmit={async () => {
              if (onBack) {
                await Tinder.addBusiness();
                return;
              }
              await Tinder.goToSecondStep();
            }}
            onChange={(values) => {
              Tinder.set('firstStepValues', values);
            }}
            values={Tinder.firstStepValues}
            getValidators={getValidatorsFirstStep}
          >
            <div className={styles.inputsHolder}>
              <div className={styles.inputRow}>
                <div className={styles.labelHolder}>
                  <label htmlFor={FIRSTSTEP.NAME}>Название бизнеса*</label>
                </div>

                <FFTextInput
                  name={FIRSTSTEP.NAME}
                  // chrome doesn't work with off
                  autoComplete="nope"
                  className={styles.inputHolder}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.labelHolder}>
                  <label htmlFor={FIRSTSTEP.PHONE}>Телефон*</label>
                </div>

                <FFPhoneInput
                  name={FIRSTSTEP.PHONE}
                  valueProxy={formatPhoneProxy}
                  onChangeProxy={normalizePhone}
                  className={styles.inputHolder}
                />
              </div>

              <SearchField />

              <div className={styles.inputRow}>
                <div className={styles.labelHolder}>
                  <label htmlFor={FIRSTSTEP.INDUSTRY}>Отрасль*</label>
                </div>

                <FFSelect
                  options={Common.industries.slice()}
                  name={FIRSTSTEP.INDUSTRY}
                  className={styles.inputHolder}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.labelHolder}>
                  <label htmlFor={FIRSTSTEP.SITE}>Соц.сети/сайт</label>
                </div>

                <FFTextInput
                  name={FIRSTSTEP.SITE}
                  className={styles.inputHolder}
                    />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.labelHolder}>
                  <label htmlFor={FIRSTSTEP.DESCRIPTION}>Опишите свои услуги*</label>
                </div>

                <FFTextArea
                  name={FIRSTSTEP.DESCRIPTION}
                  rows="2"
                  className={`${styles.inputHolder} ${styles.textareaDescription}`}
                    />
              </div>
              <div className={styles.btnHolder}>
                {
                  onBack &&
                  <ActionButton iconSlug="arrowRightMinimal" onClick={() => { Tinder.getAddressError(); }} type="submit">
                    Добавить
                  </ActionButton> ||
                  <ActionButton iconSlug="arrowRightMinimal" onClick={() => { Tinder.getAddressError(); }} type="submit">
                    Следующий шаг
                  </ActionButton>
                }
              </div>
            </div>
          </FinalForm>
        </div>
      </div>
      <div className={styles.phoneHolder} />
    </div>
  );
});

const SearchField = observer(() => {
  const { Tinder } = useContext(StoresContext);
  const [suggester, setSuggester] = useState(null);
  const addressInput = useRef();
  const handleAddressSelect = (e) => {
    Tinder.set('addressSearch', e.get('item').value);
    Tinder.getAddresses();
    suggester.destroy();
  };
  useEffect(() => {
    if (suggester && Tinder.addressesFounded?.label) {
      suggester.destroy();
      return;
    }
    window.ymaps.ready(() => {
      const suggestView = new window.ymaps.SuggestView(SUGGEST_INPUT_ID + randomId, { width: 400 });
      setSuggester(suggestView);
      Tinder.showAddressError = false;
      suggestView.events.add('select', handleAddressSelect);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      if (suggester && window.ymaps) {
        suggester.events.remove('select', handleAddressSelect);
      }
    };
  }, [Tinder.addressesFounded?.label]);

  useEffect(() => {
    if (!Tinder.addressSearch.length && Tinder.addressesFounded?.label) {
      Tinder.set('addressesFounded', null);
    }
  }, [Tinder.addressSearch.length]);

  useEffect(() => {
    if (
      Tinder.addressSearch.length && Tinder.addressesFounded?.label.length &&
      Tinder.addressSearch.length !== Tinder.addressesFounded?.label.length &&
      !Tinder.searchIsFetching
    ) {
      Tinder.set('addressesFounded', null);
    }
  }, [Tinder.addressSearch.length]);
  const changeOffAttribute = () => {
    addressInput.current.setAttribute('autocomplete', 'nope');
  };
  return (
    <div className={styles.inputRow}>
      <div className={styles.labelHolder}>
        <label htmlFor="address_yandex">Адрес*</label>
      </div>
      <div className={styles.inputHolder}>
        <TextInput
          type="text"
          onChange={(e) => {
              Tinder.set('addressSearch', e);
          }}
          name="address_yandex"
          error={Tinder.showAddressError}
          value={Tinder.addressSearch}
          onFocus={() => {
              changeOffAttribute();
              Tinder.set('showAddressError', false);
          }}
          ref={addressInput}
          id={SUGGEST_INPUT_ID + randomId}
          />
      </div>
    </div>
  );
});

export { AddBusiness, Loading };
