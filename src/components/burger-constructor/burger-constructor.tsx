import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorItems,
  getIsAuthorized,
  getOrderModalData,
  getOrderRequest,
  postOrderBurger
} from '../../services/appSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItemsStore = useSelector(getConstructorItems);
  const constructorItems = {
    bun: constructorItemsStore.bun,
    ingredients: constructorItemsStore.ingredients.map((ingredient, index) => ({
      ...ingredient,
      id: index.toString()
    }))
  };
  const isAuthorized = useSelector(getIsAuthorized);
  const orderRequest = useSelector(getOrderRequest);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderModalData = useSelector(getOrderModalData);
  //Что будет происходить по клику на "Оформить" в конструкторе заказов, передаем для запроса массив id ингредиентов
  const onOrderClick = () => {
    if (!isAuthorized) {
      navigate('/login', { state: { from: location } });
    } else {
      if (price) {
        const orderIngredientsArray: string[] = [
          constructorItems.bun,
          ...constructorItems.ingredients,
          constructorItems.bun
        ]
          .map((ingredient) => ingredient?._id)
          .filter((id): id is string => id !== undefined);
        dispatch(postOrderBurger(orderIngredientsArray));
        setIsModalOpen(true);
      }
    }
    if (!constructorItems.bun || orderRequest) return; //заглушка из исходников
  };
  const closeOrderModal = () => {
    setIsModalOpen(false);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun?.price ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isModalOpen={isModalOpen}
    />
  );
};
