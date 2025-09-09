import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  getIsFeedsLoading,
  getOrdersSelector
} from '../../services/appSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, []);
  const isLoading = useSelector(getIsFeedsLoading);
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
