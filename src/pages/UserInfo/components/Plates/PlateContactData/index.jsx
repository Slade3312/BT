import React, { useContext } from 'react';

import { observer } from 'mobx-react';
import { withEditableField } from 'enhancers';
import { formatPhoneProxy, normalizePhone } from 'utils/formatting';
import { withWrapper } from 'components/fields/TextInput/enhancers';
import { StoresContext } from 'store/mobx';
import { FFTextInput, FFPhoneInput, FFTextLabel, FFPhoneTextLabel } from 'components/fields';
import { Conditional } from 'components/helpers';
import { getClientTemplates } from 'pages/utils';
import { SubmitButton, FFSwitchLabeledIndustrySelect } from '../../UserInfoForm';
import { PlateContainer, PlateWrapper } from '../../Plate';
import Avatar from '../../Avatar';
import FormHeaderBlock from '../../FormHeaderBlock';
import PlateRow from '../../PlateRow';
import {
  FIELD_COMPANY_INDUSTRY,
  FIELD_COMPANY_WEBSITE,
  FIELD_COMPANY_SOCIAL_INSTAGRAM,
  FIELD_COMPANY_SOCIAL_FACEBOOK,
  FIELD_COMPANY_SOCIAL_VKONTAKTE,
  FIELD_EMAIL,
  FIELD_FIRST_NAME,
  FIELD_LAST_NAME,
  FIELD_MIDDLE_NAME,
  FIELD_PHONE,
  FIELD_USER_NAME,
} from '../../UserInfoForm/constants';
import styles from './styles.pcss';

const FFEditableTextInput = withEditableField([FFTextInput, FFTextLabel]);
const FFEditablePhoneInput = withEditableField([FFPhoneInput, FFPhoneTextLabel]);
const FFSwitchLabeledTextField = withWrapper({ labelSide: 'left' })(FFEditableTextInput);
const FFSwitchLabeledPhoneInput = withWrapper({ labelSide: 'left' })(FFEditablePhoneInput);
const SwitchLabeledIndustrySelect = withWrapper({ labelSide: 'left' })(FFSwitchLabeledIndustrySelect);
const PlateRequisitesContent = () => {
  const { UserInfo, Templates } = useContext(StoresContext);
  const fieldProps = {
    isSmallLabel: true,
    isSecondaryLabel: true,
    isEditable: UserInfo.isEditable,
    isLeftLabel: true,
    isBaseField: true,
  };
  const { form_userInfo } = Templates?.data?.userInfo?.UserInfo;
  const [getLabel, getPlaceholder] = getClientTemplates(form_userInfo);
  return (
    <PlateContainer column>
      <div className={styles.component}>
        <PlateWrapper>
          <Avatar />
        </PlateWrapper>

        <PlateWrapper>
          <FormHeaderBlock />
        </PlateWrapper>
      </div>

      <PlateRow leftIndent>
        <PlateWrapper isColumn>
          <SwitchLabeledIndustrySelect
            {...fieldProps}
            label={getLabel(FIELD_COMPANY_INDUSTRY)}
            name={FIELD_COMPANY_INDUSTRY}
            value={UserInfo.selectedIndustryLabel}
          />

          <Conditional condition={form_userInfo[FIELD_USER_NAME]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_USER_NAME)}
              placeholder={getPlaceholder(FIELD_USER_NAME)}
              name={FIELD_USER_NAME}
              isEditable={false}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_FIRST_NAME]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_FIRST_NAME)}
              placeholder={getPlaceholder(FIELD_FIRST_NAME)}
              name={FIELD_FIRST_NAME}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_LAST_NAME]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_LAST_NAME)}
              name={FIELD_LAST_NAME}
              placeholder={getPlaceholder(FIELD_LAST_NAME)}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_MIDDLE_NAME]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_MIDDLE_NAME)}
              name={FIELD_MIDDLE_NAME}
              placeholder={getPlaceholder(FIELD_MIDDLE_NAME)}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_PHONE]}>
            <FFSwitchLabeledPhoneInput
              {...fieldProps}
              valueProxy={formatPhoneProxy}
              onChangeProxy={normalizePhone}
              isEditable={false}
              label={getLabel(FIELD_PHONE)}
              placeholder={getPlaceholder(FIELD_PHONE)}
              name={FIELD_PHONE}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_EMAIL]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_EMAIL)}
              placeholder={getPlaceholder(FIELD_EMAIL)}
              name={FIELD_EMAIL}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_COMPANY_WEBSITE]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_COMPANY_WEBSITE)}
              placeholder={getPlaceholder(FIELD_COMPANY_WEBSITE)}
              name={FIELD_COMPANY_WEBSITE}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_COMPANY_SOCIAL_VKONTAKTE]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_COMPANY_SOCIAL_VKONTAKTE)}
              placeholder={getPlaceholder(FIELD_COMPANY_SOCIAL_VKONTAKTE)}
              name={FIELD_COMPANY_SOCIAL_VKONTAKTE}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_COMPANY_SOCIAL_FACEBOOK]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_COMPANY_SOCIAL_FACEBOOK)}
              placeholder={getPlaceholder(FIELD_COMPANY_SOCIAL_FACEBOOK)}
              name={FIELD_COMPANY_SOCIAL_FACEBOOK}
            />
          </Conditional>

          <Conditional condition={form_userInfo[FIELD_COMPANY_SOCIAL_INSTAGRAM]}>
            <FFSwitchLabeledTextField
              {...fieldProps}
              label={getLabel(FIELD_COMPANY_SOCIAL_INSTAGRAM)}
              placeholder={getPlaceholder(FIELD_COMPANY_SOCIAL_INSTAGRAM)}
              name={FIELD_COMPANY_SOCIAL_INSTAGRAM}
            />
          </Conditional>

          <SubmitButton />
        </PlateWrapper>
      </PlateRow>
    </PlateContainer>
  );
};

export default observer(PlateRequisitesContent);
