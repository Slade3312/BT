import withFinalField from 'enhancers/withFinalField';

import {
  TextInput,
  PriceInput,
  PriceInputWithoutError,
  TextAreaInput,
  PhoneInput,
  TextViewer,
  PhoneTextLabel,
  StatefulSearchInput,
} from './TextInput';
import { withError } from './TextInput/enhancers';

import Switch from './Switch';
import { MultiSelect, Select } from './Select';
import RadioGroup from './RadioGroup';
import CheckBox from './CheckBox';
import MultiplePhoneNumbersInput from './MultiplePhoneNumbersInput';
import TimeRangeSlider from './TimeRangeSlider';
import RadioBoxGroup from './RadioBoxGroup';
import RadioDefaultGroup from './RadioDefaultGroup';
import RadioChipGroup from './RadioChipGroup';
import ContentEditableLinks from './ContentEditableLinks';
import SliderWithCounter from './Sliders/SliderWithCounter';

export { MultiSelect, Select } from './Select';
export { MultiTabSelect } from './MultiTabSelect';
export { MultiFileUploadInput, SingleFileUploadInput } from './FileInputs';
export { withError } from './TextInput/enhancers';
export { default as Checkbox } from './CheckBox';
export { default as SmartCheckBoxGroup } from './SmartCheckBoxGroup';
export { default as RadioGroup } from './RadioGroup';
export { default as Switch } from './Switch';
export { default as DragAndDropAttachments } from './DragAndDropAttachments';
export { default as MultiplePhoneNumbersInput } from './MultiplePhoneNumbersInput';

export const FFTextLabel = withFinalField(TextViewer);
export const FFPhoneTextLabel = withFinalField(PhoneTextLabel);
export const FFTextInput = withFinalField(TextInput);
export const FFPriceInput = withFinalField(PriceInput);
export const FFPriceInputWithoutError = withFinalField(PriceInputWithoutError);
export const FFTextArea = withFinalField(TextAreaInput);
export const FFPhoneInput = withFinalField(PhoneInput);
export const FFCheckbox = withFinalField(CheckBox);

export const FFRadioGroup = withFinalField(RadioGroup);
export const FFRadioDefaultGroup = withFinalField(RadioDefaultGroup);
export const FFRadioChipGroup = withFinalField(RadioChipGroup);

export const FFSearchInput = withFinalField(StatefulSearchInput);
export const FFMultiplePhoneNumbersInput = withFinalField(MultiplePhoneNumbersInput);
export const FFMultiSelect = withFinalField(MultiSelect);
export const FFSelect = withFinalField(Select);
export const FFSwitch = withFinalField(Switch);
export const FFRadioBoxGroup = withFinalField(RadioBoxGroup);
// TODO: to consider about extra wrapping with some HOCs (like withError, withWrapper) inside all fields component
// maybe the best way to wrap them in this file
export const FFTimeSlider = withFinalField(withError(TimeRangeSlider));
export const FFContentEditableLinks = withFinalField(withError(ContentEditableLinks));
export const FFSliderWithCounter = withFinalField(SliderWithCounter);
