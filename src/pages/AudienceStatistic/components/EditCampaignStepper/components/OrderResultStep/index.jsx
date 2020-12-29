import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { navigate } from '@reach/router';
import { Heading } from 'components/layouts';
import { StoresContext } from 'store/mobx';
import commonStyles from 'styles/common.pcss';
import { AUDIENCE_STATISTIC_URL } from 'pages/constants';
import { REPORTS_LIST_ID } from 'pages/AudienceStatistic/constants';
import IconChooser from '../IconChooser';
import styles from './styles.pcss';
import Controls from './Controls';

const cx = classNames.bind({ ...commonStyles, ...styles });

function OrderResultStep() {
  const { UserInfo, Common, CreateReport } = useContext(StoresContext);
  const { post_pay } = UserInfo.getUserInfoCompany();

  const handleNavigate = (event) => {
    event.preventDefault();
    CreateReport.set('isModalVisible', false);
    navigate(`${AUDIENCE_STATISTIC_URL}#${REPORTS_LIST_ID}`);
  };

  return (
    <>
      <IconChooser className={cx('marb-l')} type={IconChooser.propConstants.types.success} />

      <Heading level={2} className={cx('marb-m', 'title')}>
        {Common.constants.FREE_FOCUS || post_pay ? 'Отчет будет готов\n через пару минут' : 'Заявка на оплату отправлена'}
      </Heading>

      <Heading level={post_pay ? 4 : 3} className={cx('marb-l', 'title')}>
        {Common.constants.FREE_FOCUS && (
          <div>{'Найти анализ вашей аудитории вы сможете\n в разделе'} <a href="/" onClick={handleNavigate}>«Мои отчеты»</a></div>
        )}

        {!Common.constants.FREE_FOCUS && (
          post_pay
          ? 'Уже начинаем анализировать вашу аудиторию. Отчет будет готов в течение одного часа. Он появится в разделе «Мои кампании» личного кабинета. Вы об этом сразу узнаете — получите уведомление на email, указанный при регистрации.'
          : 'После оплаты мы пришлём вам на почту ссылку с отчётом.'
        )}
      </Heading>

      <Controls onClick={handleNavigate} buttonText="Посмотреть отчет" className={cx('button')} />
    </>
  );
}

export default observer(OrderResultStep);
