import { useReducer, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Header/Modals.module.css';

const initialFormState = {
  name: '',
  category: '',
  price: '',
  description: '',
  images: '',
  categories: [],
  userId: localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))._id
    : 'none',
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

export const CreateAd = ({ setAds, setIsCreateAdOpen }) => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        dispatch({ type: 'SET_CATEGORIES', payload: res.data });
        if (res.data.length > 0) {
          dispatch({ type: 'SET_CATEGORY', payload: res.data[0].name });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')).token
      : 'none';
    if (!userToken) {
      alert('login to Create an Ad');
      return;
    }
    const postAd = async () => {
      try {
        await axios.post(
          'http://localhost:5000/api/ads',
          {
            name: state.name,
            category: state.category,
            price: state.price,
            description: state.description,
            user: state.userId,
            images: [state.images],
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Ad created successfully');
        const res = await axios.get('http://localhost:5000/api/ads');
        setAds(res.data);
      } catch (error) {
        console.error('Error creating ad:', error);
        alert('Failed to create ad');
      }
    };
    postAd();
    setIsCreateAdOpen(false);
  };

  return (
    <>
      <div className={styles.modal}>
        <button
          className={styles.btnCloseModal}
          onClick={() => setIsCreateAdOpen(false)}
        >
          &times;
        </button>
        <h2 className={styles.modalHeader}>Create New Ad</h2>
        <form className={styles.modalForm} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Choose a Category</label>
            <select
              onChange={(e) =>
                dispatch({ type: 'SET_CATEGORY', payload: e.target.value })
              }
              required
            >
              {state.categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Enter a Name</label>
            <input
              className={styles.input}
              type="text"
              value={state.name}
              onChange={(e) =>
                dispatch({ type: 'SET_NAME', payload: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Enter a Price</label>
            <input
              className={styles.input}
              type="number"
              value={state.price}
              onChange={(e) =>
                dispatch({ type: 'SET_PRICE', payload: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Enter a Description</label>
            <textarea
              style={{ resize: 'none' }}
              className={styles.input}
              value={state.description}
              onChange={(e) =>
                dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Enter an Image url</label>
            <input
              className={styles.input}
              type="text"
              value={state.images}
              onChange={(e) =>
                dispatch({ type: 'SET_IMAGES', payload: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className={`${styles.btn} ${styles.editSubmitBtns}`}
          >
            Submit
          </button>
        </form>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};
