import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { composeRequiredValidator, composeEmailValidator } from 'utils/fieldValidators';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { FinalForm } from 'components/forms/index';
import { FFCheckbox, FFTextInput } from 'components/fields';


import OfferButtonWrapper from '../OfferButtonWrapper';

import { OFFER_CHECKED_FIELD } from '../../../constants';
import styles from './styles.pcss';


const cx = classNames.bind({ ...commonStyles, ...styles });

const getValidators = () => ({
  email: [
    composeRequiredValidator('Это поле обязательно для заполнения'),
    composeEmailValidator('Email должен быть заполнен в формате XXXX@XXX.XX'),
  ],
});

const OfferForm = ({ buttonText, labelText, onSubmit }) => {
  const { UserInfo } = useContext(StoresContext);
  return (
    <FinalForm
      className={cx('form')}
      getValidators={getValidators}
      onSubmit={(e) => onSubmit(e.email)}
      values={{ email: UserInfo?.data?.email }}
    >
      <iframe
        className={cx('contentContainer')}
        src="/offer.html"
        title="offer"
      />

      <FFCheckbox
        className={cx('label')}
        name={OFFER_CHECKED_FIELD}
        label={labelText}
      />

      <div className={cx('inputRow')}>

        <div className={styles.labelHolder}>
          <label htmlFor="email">Электронная почта</label>
        </div>

        <FFTextInput
          name="email"
          id="email"
          placeholder="maria@domain.ru"
          className={cx('inputHolder')}
        />
      </div>

      <OfferButtonWrapper
        className={cx('button')}
        buttonText={buttonText}
      />
    </FinalForm>
  );
};

OfferForm.propTypes = {
  buttonText: PropTypes.string,
  labelText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default observer(OfferForm);
