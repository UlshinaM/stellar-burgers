import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getError,
  getIsAuthorized,
  getIsLoading,
  getIsRegistred,
  getUserData,
  postRegisterUser
} from '../../services/appSlice';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const errorSubmit = useSelector(getError);
  const isLoading = useSelector(getIsLoading);
  const userData = useSelector(getUserData);
  const isRegistred = useSelector(getIsRegistred);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(errorSubmit);
  //const [user, setUser] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    setErrorText('');
  }, [userName, email, password, userData]);

  /*if (userData) {
    return <Navigate to='/login' replace />; //Должен происходит переход на страницу логина после успешной регистрации
  }*/

  if (errorSubmit) {
    setErrorText(errorSubmit);
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName && email && password) {
      dispatch(
        postRegisterUser({ name: userName, email: email, password: password })
      );
    } else {
      setErrorText('Введите данные');
    }
  };

  return isLoading ? (
    <Preloader />
  ) : isRegistred ? (
    <Navigate to='/login' replace />
  ) : (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
