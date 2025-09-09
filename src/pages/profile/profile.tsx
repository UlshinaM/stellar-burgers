import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  getIsLoading,
  getUserData,
  updateUserData
} from '../../services/appSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const userData = useSelector(getUserData);
  const isLoading = useSelector(getIsLoading);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });

  const isFormChanged =
    formValue.name !== userData?.name ||
    formValue.email !== userData?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserData(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userData) {
      setFormValue({
        name: userData.name,
        email: userData.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  //return <p>It's ok</p>;
  return isLoading ? (
    <Preloader />
  ) : (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
