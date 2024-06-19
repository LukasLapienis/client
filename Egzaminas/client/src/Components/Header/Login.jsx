import React, { useReducer } from 'react';
import styles from './Modals.module.css';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../Main/SmallerComponents/Button';

const initialState = {
  email: '',
  password: '',
  showPassword: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setEmail':
      return {
        ...state,
        email: action.payload,
      };
    case 'setPassword':
      return {
        ...state,
        password: action.payload,
      };
    case 'loggedIn':
      console.log('Loggin in with', state.email, state.password);
      return initialState;
    case 'showedPassword':
      return {
        ...state,
        showPassword: !state.showPassword,
      };
    default:
      return initialState;
  }
}

const Login = ({ closeModal, BASE_URL, handleLoginSuccess, setUserRole, openSignupModal }) => {
  const [{ password, email, showPassword }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function loginUser() {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      const { token, username, role, _id } = res.data;

      localStorage.setItem(
        'userData',
        JSON.stringify({ token, username, role, _id })
      );
      setUserRole(role);

      console.log(res);
      handleLoginSuccess();
    } catch (error) {
      alert('There was an error loading data...');
      console.error(error);
    }
  }

  function handleChangeEmail(e) {
    dispatch({ type: 'setEmail', payload: e.target.value });
  }
  function handleChangePassword(e) {
    dispatch({ type: 'setPassword', payload: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    loginUser();
    dispatch({ type: 'loggedIn' });
    closeModal();
  }

  return (
    <>
      <div className={styles.modal}>
        <button className={styles.btnCloseModal} onClick={closeModal}>
          &times;
        </button>
        <h2 className={styles.modalHeader}>
          Please login to your <br />
          <span className={styles.highlight}>AdVantage </span>
          account
        </h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.label}>Email</label>
          <input
            type="text"
            className={styles.input}
            value={email}
            onChange={handleChangeEmail}
          />

          <label className={styles.label}>Password</label>
          <div className={styles.inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              value={password}
              onChange={handleChangePassword}
            />
            <i onClick={() => dispatch({ type: 'showedPassword' })}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </i>
          </div>
          <button className={styles.btn}>Login</button>
        </form>
        <div className={styles.alreadyUser}>
          <p>Don't have an account ?</p>
          <Button onClick={openSignupModal} type="show">
            Register
          </Button>
        </div>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};

export default Login;
