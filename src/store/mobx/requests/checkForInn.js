import confirmDialog from 'components/modals/confirmDialog';
import { ConfirmInn, SelectUserType, ConfirmInnPrivate } from 'components/modals';
import UserInfo from '../UserInfo';

const checkForInn = async (onOpenDialog, onCloseDialog, props, { isWithoutCheckInn } = {}) => {
  if (UserInfo.data.company.inn && !isWithoutCheckInn) return true;

  onOpenDialog && onOpenDialog();
  const userType = await confirmDialog(SelectUserType, props);
  let userResponse;
  if (userType === 2) {
    userResponse = await confirmDialog(ConfirmInn, props);
  } else if (userType === 1) {
    userResponse = await confirmDialog(ConfirmInnPrivate, props);
  }

  if (userResponse) {
    await UserInfo.getUser(true);
  }
  onCloseDialog && onCloseDialog(userResponse);
  /* eslint-disable */
    return userResponse;
  /* eslint-enable */
};

export default checkForInn;
