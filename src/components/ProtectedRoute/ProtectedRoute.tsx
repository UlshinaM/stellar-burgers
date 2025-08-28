import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRouteProps } from './type';
import { useSelector } from 'react-redux';
import { getIsAuthorized, getIsLoading } from '../../services/appSlice';
import { Preloader } from '@ui';

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(getIsAuthorized);
  const isLoading = useSelector(getIsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (!isAuthorized && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (isAuthorized && onlyUnAuth) {
    //если маршрут для неавторизованного пользователя, но пользователь авторизован
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
