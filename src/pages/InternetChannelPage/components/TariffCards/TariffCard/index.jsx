import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { ActionButton } from 'components/buttons';
import commonStyles from 'styles/common.pcss';
import { GlobalIcon } from 'components/common';
import { formatPriceWithLabel } from 'utils/formatting';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const TariffCard = ({
  name,
  price,
  clicks,
  cpc,
  onChange,
  onQuestionButtonClick,
  selected,
  id,
  icons,
}) => (
  <div className={cx('card-container')}>
    <div className={cx('title')}>{name}</div>
    <div className={cx('divider')} />
    <div className={cx('stats')}>

      <div className={cx('stats-container')}>
        <div className={cx('stats-row')}>
          <div className={cx('stats-title')}>Количество кликов</div>
          <div className={cx('stats-info')}>
            <span className={cx('stats-price')}>{clicks}</span>
            <span className={cx('stats-title-unit')}>шт.</span>
          </div>
        </div>

        <div className={cx('stats-row')}>
          <div className={cx('stats-title')}>Стоимость за клик</div>
          <div className={cx('stats-info')}>
            <span className={cx('stats-price')}>{cpc}</span>
            <span className={cx('stats-title')}>руб.</span>
          </div>
        </div>
      </div>
    </div>
    <div className={cx('divider')} />
    <div className={cx('section-title')}>Инструменты интернет-рекламы:</div>
    <div className={cx('social-container')}>
      <div className={cx('social-item')}>
        <div className={cx('social-title', 'marb-xs')}>
          Поиск
        </div>
        <div className={cx('icons-holder')}>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_1?.[0]} />
          </div>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_1?.[1]} />
          </div>
        </div>
      </div>

      <div className={cx('social-item')}>
        <div className={cx('social-title', 'marb-xs')}>
          Сеть
        </div>
        <div className={cx('icons-holder')}>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_2?.[0]} />
          </div>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_2?.[1]} />
          </div>
        </div>
      </div>

      <div className={cx('social-item')}>
        <div className={cx('social-title', 'marb-xs')}>
          Соцсети
        </div>
        <div className={cx('icons-holder')}>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_3?.[0]} />
          </div>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_3?.[1]} />
          </div>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_3?.[2]} />
          </div>
          <div className={cx('social-icon')}>
            <GlobalIcon icon={icons?.type_id_3?.[3]} />
          </div>
        </div>
      </div>

    </div>
    <div className={cx('divider', 'total-divider')} />
    <div className={cx('total-container', 'marb-se')}>
      <div className={cx('total-price')}>
        <div className={cx('total-title')}>Итого:</div>
        <div className={cx('total-price-value')}>{formatPriceWithLabel(price)} </div>
      </div>
      {selected ?
        <div className={cx('choosen')}>
          <GlobalIcon slug="checked" className={cx('choosen-icon')} />
          Выбрано
        </div> :
        <ActionButton type="button" onClick={() => onChange(id)}>
          Выбрать
        </ActionButton>
      }
    </div>
    <div className={cx('ask-question')} onClick={onQuestionButtonClick}>
      <span tabIndex="0" role="link" className={cx('link')}>Задайте вопрос</span> нашему специалисту
    </div>
  </div>
);

TariffCard.propTypes = {
  selected: PropTypes.bool,
  name: PropTypes.string,
  price: PropTypes.number,
  clicks: PropTypes.number,
  cpc: PropTypes.number,
  onChange: PropTypes.func,
  onQuestionButtonClick: PropTypes.func,
  id: PropTypes.number,
  icons: PropTypes.object,
};

export default TariffCard;
