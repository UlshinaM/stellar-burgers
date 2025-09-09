import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/appSlice';

export const AppHeader: FC = () => {
  const userData = useSelector(getUserData);
  const userName = userData?.name || '';
  return <AppHeaderUI userName={userName} />;
};
