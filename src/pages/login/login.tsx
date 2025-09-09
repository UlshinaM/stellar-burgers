import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getError,
  getIsAuthorized,
  getIsLoading,
  getUser,
  getUserData,
  loginUser
} from '../../services/appSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const error = useSelector(getError);
  const isAuthorized = useSelector(getIsAuthorized);
  const isLoading = useSelector(getIsLoading);
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email, password: password }));
  };

  return isAuthorized ? (
    <Navigate replace to={from} />
  ) : isLoading ? (
    <Preloader />
  ) : (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
