import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIsLoading,
  getIsUserOrdersLoading,
  getUserOrders,
  getUserOrdersSelector
} from '../../services/appSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);
  const userOrders = useSelector(getUserOrdersSelector);
  const isLoading = useSelector(getIsUserOrdersLoading);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = userOrders;

  //Для теста стилей заказов в разном состоянии
  /*const orders: TOrder[] = [
    {
      _id: '68b04815673086001ba852e5',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2025-08-28T12:14:13.192Z',
      updatedAt: '2025-08-28T12:14:14.056Z',
      number: 87373
    },
    {
      _id: '68b0471c673086001ba852e2',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'pending',
      name: 'Краторный астероидный бургер',
      createdAt: '2025-08-28T12:10:04.408Z',
      updatedAt: '2025-08-28T12:10:05.232Z',
      number: 87372
    },
    {
      _id: '68b046c1673086001ba852e0',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'pending',
      name: 'Краторный био-марсианский люминесцентный метеоритный бургер',
      createdAt: '2025-08-28T12:08:33.018Z',
      updatedAt: '2025-08-28T12:08:33.872Z',
      number: 87371
    },
    {
      _id: '68b045fb673086001ba852dd',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0944',
        '643d69a5c3f7b9001cfa0947',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'canceled',
      name: 'Space фалленианский краторный бессмертный традиционный-галактический бургер',
      createdAt: '2025-08-28T12:05:15.782Z',
      updatedAt: '2025-08-28T12:05:16.624Z',
      number: 87370
    }
  ];*/

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
