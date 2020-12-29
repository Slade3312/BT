import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useFormState } from 'react-final-form';
import { FormFieldLabel } from 'components/forms';

import { withError } from 'components/fields/TextInput/enhancers';
import { ACTIVITY_FIELD } from 'store/NewCampaign/channels/constants';
import { StoresContext } from 'store/mobx';
import Suggester from '../Suggester/Suggester';
import styles from './styles.pcss';

const Error = withError('span');

const CoastPerActionBlock = ({ onChange, value }) => {
  const { Templates } = useContext(StoresContext);
  const { submitFailed } = useFormState();
  const { errors: { [ACTIVITY_FIELD]: error } } = useFormState();
  const [localError, setLocalError] = useState(false);
  const { coastPerActionBlock: { title, description } } = Templates.getNewCampaignTemplate('BriefOrderVoice');

  useEffect(() => {
    if (submitFailed) {
      setLocalError(true);
    }
  }, [submitFailed]);

  return (
    <div className={styles.container}>
      <FormFieldLabel isBold>
        {title}
      </FormFieldLabel>

      <div className={styles.suggesterContainer}>
        <Suggester onChange={onChange} value={value} />

        <Error
          errorClassName={styles.error}
          name={ACTIVITY_FIELD}
          keepErrorIndent={false}
          error={localError ? error : null}
        />
      </div>

      <FormFieldLabel className={styles.description}>
        {description}
      </FormFieldLabel>
    </div>
  );
};

CoastPerActionBlock.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.shape({}),
};

export default observer(CoastPerActionBlock);
