import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  getOrderRequest,
  getOrdersSelector,
  getOrdersTotal,
  getOrdersTotalToday
} from '../../services/appSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getOrdersSelector);
  const feed = {
    total: useSelector(getOrdersTotal),
    totalToday: useSelector(getOrdersTotalToday)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');
  /*const pendingOrders = [
    orders[1].number,
    orders[13].number,
    orders[45].number
  ];*/
  /*const orderPending = useSelector(getOrderRequest);
  if (orderPending) {
    pendingOrders.push();
  }*/

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
