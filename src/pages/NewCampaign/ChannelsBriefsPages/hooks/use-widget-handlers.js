import { useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { ORDER_IS_ACTIVE } from 'store/NewCampaign/channels/constants';
import { setPromocodeOverdue } from 'store/NewCampaign/campaign/actions';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { useGetChannelIsActiveMap } from 'pages/NewCampaign/hooks/use-get-channel-is-active-map';
import { useUpdateIsActive } from '../containers/ChannelWidget/useUpdateIsActive';
import { useWidgetNavigation } from './use-widget-navigation';

export const useWidgetHandlers = (channelType) => {
  const {
    values: { id: orderId },
  } = useFormState();

  const isActiveChannel = useGetChannelIsActiveMap()[channelType];

  const { change } = useForm();

  const dispatch = useDispatch();

  const { handleActivate, isLoading } = useUpdateIsActive(orderId);

  const handleNavigate = useWidgetNavigation(channelType);
  const promocodeData = useSelector(getCampaignPromocodeData)[channelType] || {};

  const handleToggleChange = async () => {
    const { is_active: nextActive } = await handleActivate(!isActiveChannel);
    change(ORDER_IS_ACTIVE, nextActive);
    dispatch(setPromocodeOverdue(promocodeData));
  };

  const handleWidgetClick = async () => {
    if (!isActiveChannel) {
      const { is_active: nextActive } = await handleActivate(true);
      change(ORDER_IS_ACTIVE, nextActive);
      dispatch(setPromocodeOverdue(promocodeData));
      // to view that toggle animation is changing
      setTimeout(handleNavigate, 100);
    } else {
      handleNavigate();
    }
  };

  return {
    handleWidgetClick,
    handleToggleChange,
    isLoading,
  };
};
