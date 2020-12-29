import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { requestFeedback } from 'requests/feedback';
import { sendRequest } from 'store/requests/actions';
import { composeRequiredValidator } from 'utils/fieldValidators';
import { FEEDBACK_REQUEST_KEY, QUESTION_NAME_FIELD } from 'requests/feedback/constants';
import { FFTextArea } from 'components/fields';
import { FinalForm } from 'components/forms';
import { ActionButton } from 'components/buttons';
import { useOnBlurBlockFieldsGA } from 'utils/ga-analytics/hooks';
import { getFeedbackPopupTemplate } from 'store/common/templates/popups/selectors';

import {
  BLOCK_NAME,
  handleGASaveQuestionCreator,
} from './ga/utils';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function FeedbackForm({ className, onSubmit, info: { button, input } }) {
  const onBlurBlockFieldGA = useOnBlurBlockFieldsGA({ blockName: BLOCK_NAME, event: 'event_b2b_question', action: `change_field_${QUESTION_NAME_FIELD}` });

  const getValidators = () => ({
    [QUESTION_NAME_FIELD]: composeRequiredValidator('Обязательное поле'),
  });

  const handleSubmit = (values) => {
    onSubmit({ key: FEEDBACK_REQUEST_KEY, data: values });
  };


  return (
    <FinalForm onSubmit={handleSubmit} getValidators={getValidators} className={className}>
      <FFTextArea
        onBlur={onBlurBlockFieldGA}
        name={QUESTION_NAME_FIELD}
        placeholder={input}
      />
      <ActionButton type="submit" className={cx('button')}>
        {button}
      </ActionButton>
    </FinalForm>
  );
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  info: PropTypes.shape({
    button: PropTypes.string,
    input: PropTypes.string,
  }),
};

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch(sendRequest(handleGASaveQuestionCreator(requestFeedback), data)),
});

export default connect(
  state => ({
    info: getFeedbackPopupTemplate(state),
  }),
  mapDispatchToProps,
)(FeedbackForm);
