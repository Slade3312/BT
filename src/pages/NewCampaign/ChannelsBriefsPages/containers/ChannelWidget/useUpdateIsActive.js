import { useState } from 'react';
import { changeOrderIsActiveRequest } from 'requests/orders';

export const useUpdateIsActive = (orderId) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleActivate = async (flag) => {
    setIsLoading(true);

    try {
      return await changeOrderIsActiveRequest({
        is_active: flag,
        id: orderId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleActivate,
  };
};
