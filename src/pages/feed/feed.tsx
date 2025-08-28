import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  getIsLoading,
  getOrdersSelector
} from '../../services/appSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrdersSelector);

  const handleUpdateOrders = () => {
    dispatch(getFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return isLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleUpdateOrders} />
  );
};
