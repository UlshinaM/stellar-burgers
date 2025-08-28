import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TUser } from '@utils-types';
import { RootState } from './store';
import { deleteCookie, setCookie } from '../utils/cookie';

type TConstructorItems = {
  bun: TIngredient | undefined;
  ingredients: TIngredient[];
};

interface IState {
  isAuthorized: boolean;
  isLoading: boolean; //Отвечает за прелоадер, если данные еще не загрузились с сервера
  isRegistred: boolean;
  ingredients: TIngredient[];
  constructorItems: TConstructorItems; //Объект с информацией о бургере в заказе
  orders: TOrder[]; //Все заказы, которые можно посмотреть в ленте
  ordersTotal: number;
  ordersTotalToday: number;
  orderRequest: boolean; //булева переменная-флаг по которой отслеживается отправка ПОСТ-запроса по заказу бургера
  orderModalData: TOrder | null; //Предположительно Ответ от сервера по ПОСТ-запросу заказа бургера
  userOrders: TOrder[];
  user?: TUser | undefined;
  error: string | undefined;
}

const initialState: IState = {
  isAuthorized: false,
  isLoading: false,
  isRegistred: false,
  ingredients: [],
  constructorItems: { bun: undefined, ingredients: [] },
  orders: [],
  ordersTotal: 0,
  ordersTotalToday: 0,
  orderRequest: false,
  orderModalData: null,
  userOrders: [],
  user: undefined,
  error: undefined
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    deleteIngredient: (state, action) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    changeIngredientOrder: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload + 1]
      ] = [
        state.constructorItems.ingredients[action.payload + 1],
        state.constructorItems.ingredients[action.payload]
      ];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.ordersTotal = action.payload.total;
        state.ordersTotalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(postRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false;
        //state.user = action.payload;
        state.isRegistred = true;
      })
      .addCase(postRegisterUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(postRegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.isRegistred = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthorized = true;
      })
      .addCase(getUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = false;
        state.error = action.error.message;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserData.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        if (action.payload) {
          const { order, feeds, totalOrders, totalToday } = action.payload;
          state.orderModalData = order;
          state.userOrders = [order, ...state.userOrders];
          if (totalOrders) {
            state.orders = feeds;
            state.ordersTotal = totalOrders;
            state.ordersTotalToday = totalToday;
          } else {
            state.orders = [order, ...state.orders];
            ++state.ordersTotal;
            ++state.ordersTotalToday;
          }
        }
        state.orderRequest = false;
        state.constructorItems.bun = undefined;
        state.constructorItems.ingredients = [];
      })
      .addCase(postOrderBurger.pending, (state) => {
        state.error = undefined;
        state.orderModalData = null;
        state.orderRequest = true;
      })
      .addCase(postOrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthorized = false;
        state.orderRequest = false;
        state.orderModalData = null;
        state.userOrders = [];
        state.user = undefined;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.userOrders = action.payload;
        }
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
); //все закакзы, без регистрации, для страницы Лента заказов

export const getUserOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
); //закаказы авторизован

export const getUser = createAsyncThunk('user/get', async () => getUserApi());

export const postRegisterUser = createAsyncThunk(
  'user/register',
  async ({ name, email, password }: TRegisterData) => {
    const userData = await registerUserApi({ name, email, password });
    if (userData?.success) {
      setCookie('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      return userData.user;
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => {
    const userData = await loginUserApi({ email, password });
    if (userData?.success) {
      setCookie('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      localStorage.setItem('isAuthorized', 'true');
      return userData.user;
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const userData = await logoutApi();
  if (userData.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthorized');
    //return userData.user;
  }
});

export const updateUserData = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const updateData = await updateUserApi(user);
    if (updateData.success) return updateData.user;
  }
);

export const postOrderBurger = createAsyncThunk(
  'order/post',
  async (ingredients: string[]) => {
    const orderData = await orderBurgerApi(ingredients);
    if (orderData.success) {
      const feedsData = await getFeedsApi();
      if (feedsData.success) {
        return {
          order: orderData.order,
          feeds: feedsData.orders,
          totalOrders: feedsData.total,
          totalToday: feedsData.totalToday
        };
      } else {
        return {
          order: orderData.order,
          feeds: [],
          totalOrders: 0,
          totalToday: 0
        };
      }
    }
  }
);

export const getError = (state: RootState) => state.error;
export const getIngredientsSelector = (state: RootState) => state.ingredients;
export const getIsLoading = (state: RootState) => state.isLoading;
export const getConstructorItems = (state: RootState) => state.constructorItems;
export const getOrderRequest = (state: RootState) => state.orderRequest;
export const getOrderModalData = (state: RootState) => state.orderModalData;
export const getOrdersSelector = (state: RootState) => state.orders;
export const getOrdersTotal = (state: RootState) => state.ordersTotal;
export const getOrdersTotalToday = (state: RootState) => state.ordersTotalToday;
export const getIsAuthorized = (state: RootState) => state.isAuthorized;
export const getIsRegistred = (state: RootState) => state.isRegistred;
export const getUserData = (state: RootState) => state.user;
export const getUserOrdersSelector = (state: RootState) => state.userOrders;

export const appReducer = appSlice.reducer;

export const {
  addBun,
  addIngredient,
  deleteIngredient,
  changeIngredientOrder
} = appSlice.actions;
