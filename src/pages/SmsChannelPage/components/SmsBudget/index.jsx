import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { navigate, Link } from '@reach/router';
import Skeleton from 'react-loading-skeleton';
import { useFormState } from 'react-final-form';
import { Switch, FFPriceInput } from 'components/fields';
import { ORDER_BUDGET_FIELD, EXTERNAL_OPERATOR } from 'store/NewCampaign/channels/constants';
import { formatPrice } from 'utils/formatting';
import Icon from 'components/common/GlobalIcon/assets/ruble.svg';
import { useBaseChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';
import { StoresContext } from 'store/mobx';

import { withError } from 'components/fields/TextInput/enhancers';
import { withFinalField, withForwardedRef } from 'enhancers';

import { GlobalIcon, Tooltip } from 'components/common';
import { ActionButton } from 'components/buttons/ActionButtons';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import styles from './styles.pcss';

const PriceInput = withError(withForwardedRef(FFPriceInput));
const FFSwitch = withFinalField(Switch);

const SmsBudget = observer(() => {
  const { NewCampaign, WebsAndPhonesTaxons, Common } = useContext(StoresContext);
  const {
    minBudget,
    isAudienceSmall,
    avgEvents,
    maxBudget,
    eventsName,
    eventsExternalName,
  } = useBaseChannelCalculatedInfo(NewCampaign.currentCampaign.channel_uid);
  const budgetPercent = () => {
    let percent = 0;
    if (maxBudget && NewCampaign.currentCampaign.currentOrder.budget) {
      percent = NewCampaign.currentCampaign.currentOrder.budget * 100 / maxBudget;
    }
    let result = percent * 330 / 100;
    if (result > 317) result = 317;
    return result;
  };

  const { errors } = useFormState();

  const normalAudience = () => {
    return (
      <>
        {
          WebsAndPhonesTaxons.webSitesOnOfLine !== 'online' &&
          <div className={styles.checkboxHolder}>
            <FFSwitch
              name={EXTERNAL_OPERATOR}
              keepErrorIndent={false}
            />
            <div className={styles.checkboxText}>Хочу отправить SMS на других операторов <Tooltip>Текст тултипа</Tooltip></div>
          </div>
        }
        <div className={styles.infoRow}>
          <div className={styles.budgetInput}>
            <div className={styles.budgetTitle}>
              Введите планируемый бюджет
            </div>
            <div className={styles.priceHolder}>
              <PriceInput
                disabled={
                  NewCampaign.currentCampaign?.currentOrder?.is_editable &&
                  NewCampaign.currentCampaign.status_id !== 5 &&
                  NewCampaign.currentCampaign?.currentOrder?.status_id === 7
                }
                name={ORDER_BUDGET_FIELD}
                placeholder={formatPrice(minBudget)}
                keepErrorIndent={false}
                Icon={Icon}
              />
              {
                !errors.hasOwnProperty([ORDER_BUDGET_FIELD]) &&
                <div className={styles.priceRanger}>
                  <div
                    className={styles.dot}
                    style={{ borderLeft: `${budgetPercent()}px solid #FFDC7D` }}/>
                  <div>{formatPrice(minBudget)}</div>
                  <div>{formatPrice(maxBudget)}</div>
                </div>
              }
            </div>
            {
              NewCampaign.currentCampaign.currentOrder.budget >= Common.constants.EXTERNAL_OPERATOR_MIN_BUDGET &&
                NewCampaign.currentCampaign.currentOrder.external_operator === false &&
                <div className={styles.externalNote}>
                  От бюждета {formatPrice(Common.constants.EXTERNAL_OPERATOR_MIN_BUDGET)} ₽ вы можете <br/>использовать рассылку на других операторов
                </div>
            }

            {
              NewCampaign.currentCampaign.currentOrder.external_operator &&
              <div className={styles.externalNote}>
                <div>
                  Рассылка SMS на других операторов<br/> осуществляется от бюджета в {formatPrice(Common.constants.EXTERNAL_OPERATOR_MIN_BUDGET)} ₽
                </div>
              </div>
            }

          </div>

          <div>
            <div className={styles.operatorsHolder}>
              <div className={styles.beelineInfo}>
                <div className={styles.operatorTitle}>На Билайн</div>
                {
                  NewCampaign.calculating &&
                  <div className={styles.messagesNumber}><Skeleton width={70} /> <span className={styles.eventsName}>сообщений</span></div> ||
                  <div className={styles.messagesNumber}>{formatPrice(avgEvents)} <span className={styles.eventsName}>{eventsName}</span></div>
                }
                <div className={styles.additionalInfo}>Примерное количество сообщений</div>
              </div>

              <div className={styles.otherInfo}>
                <div className={styles.operatorTitle}>На других операторов</div>
                <div />
                {
                  NewCampaign.currentCampaign?.currentOrder?.external_operator &&
                  <div className={styles.messagesNumber}>
                    {
                      NewCampaign.calculating ? <Skeleton width={70}/> : formatPrice(NewCampaign.calculate.external_operator_qty)
                    }
                    <span className={styles.eventsName}>{eventsExternalName}</span>
                  </div> ||
                  <div className={styles.additionalInfo}>Рассылка на других<br/> операторов не включена</div>
                }

                {
                  NewCampaign.currentCampaign?.currentOrder?.external_operator &&
                  <div className={styles.additionalInfo}>Примерное количество сообщений</div>
                }
              </div>
            </div>

            {
              isAudienceSmall &&
                <div className={styles.tooMuchAudience}>
                  <div className={styles.smallAttention}>
                    Доступное количество номеров превышает выбранную вами аудиторию
                  </div>
                  <Link to={`${NEW_CAMPAIGN_URL}${NewCampaign.currentCampaign.id}/audience`} className={styles.changeAudienceLink}>Изменить аудиторию</Link>
                </div> || null
            }
          </div>

        </div>
      </>
    );
  };

  const zeroAudience = () => {
    return (
      <div className={styles.zeroAudienceText}>
        <GlobalIcon slug="warningRed" className={styles.warningSign} />
        Количество вашей аудитории равно нулю, измените настройки аудитории, чтобы запустить рекламную кампанию
        <ActionButton
          className={styles.btn}
          onClick={() => {
            navigate(`${NEW_CAMPAIGN_URL}${NewCampaign.currentCampaign.id}/audience`);
          }}
        >
          Изменить аудиторию
        </ActionButton>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Расчёт рекламной кампании</div>
      <div className={styles.infoHolder}>
        {
          NewCampaign.currentCampaign.audience !== 0 &&
          normalAudience() ||
            zeroAudience()
        }
      </div>
    </div>
  );
});

export default SmsBudget;
