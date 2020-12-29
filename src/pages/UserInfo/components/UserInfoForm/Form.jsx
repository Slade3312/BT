import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { set } from 'mobx';
import { observer } from 'mobx-react';
import { composePhoneValidator, composeRequiredValidator, composeEmailValidator } from 'utils/fieldValidators';
import { StoresContext } from 'store/mobx';
import { FinalForm } from 'components/forms';
import { composeUserInitialsLengthValidator, composeUserInitialsValidator }
  from 'pages/UserInfo/components/UserInfoForm/helpers';
import { FIELD_FIRST_NAME, FIELD_LAST_NAME, FIELD_MIDDLE_NAME, FIELD_PHONE, FIELD_EMAIL } from './constants';


const UserInfoForm = ({ children }) => {
  const getValidators = () => ({
    [FIELD_PHONE]: [
      composeRequiredValidator('Обязательное поле'),
      composePhoneValidator('Номер телефона должен быть заполнен в формате 9XXXXXXXXX'),
    ],
    [FIELD_FIRST_NAME]: [
      composeRequiredValidator('Обязательное поле'),
      composeUserInitialsLengthValidator('Минимальная длина поля - 2 символа без учёта пробелов'),
      composeUserInitialsValidator(`Имя может содержать только символы кириллицы,
        а также пробелы, знак ' и тире`),
    ],
    [FIELD_LAST_NAME]: [
      composeRequiredValidator('Обязательное поле'),
      composeUserInitialsLengthValidator('Минимальная длина поля - 2 символа без учёта пробелов'),
      composeUserInitialsValidator(`Фамилия может содержать только символы кириллицы,
       а также пробелы, знак ' и тире`),
    ],
    [FIELD_EMAIL]: [
      composeRequiredValidator('Обязательное поле'),
      composeEmailValidator('Email должен быть заполнен в формате XXXX@XXX.XX'),
    ],
    [FIELD_MIDDLE_NAME]: [
      composeRequiredValidator('Обязательное поле'),
      composeUserInitialsLengthValidator('Минимальная длина поля - 2 символа без учёта пробелов'),
      composeUserInitialsValidator(`Отчество может содержать только символы кириллицы,
        а также пробелы, знак ' и тире`),
    ],
  });

  const { UserInfo, Common } = useContext(StoresContext);
  const onChange = (val) => {
    set(UserInfo.data, val);
  };

  return (
    <FinalForm
      onError={Common.setError}
      onSubmit={UserInfo.updateUser}
      onChange={onChange}
      values={UserInfo.data}
      getValidators={getValidators}
    >
      {children}
    </FinalForm>
  );
};


UserInfoForm.propTypes = {
  children: PropTypes.node,
};

export default observer(UserInfoForm);
