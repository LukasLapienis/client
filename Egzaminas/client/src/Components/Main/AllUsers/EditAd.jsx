import { useReducer, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Header/Modals.module.css';

const initialEditState = {
  name: '',
  category: {},
  price: '',
  description: '',
  images: '',
  categories: [],
  userId: localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))._id
    : 'none',
};

const editAdReducer = (state, action) => {
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
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const EditAd = ({ adToEdit, setIsEditOpen, setAds }) => {
  const [state, dispatch] = useReducer(editAdReducer, initialEditState);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        dispatch({ type: 'SET_CATEGORIES', payload: res.data });
        console.log(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    dispatch({
      type: 'SET_INITIAL_STATE',
      payload: {
        name: adToEdit.name,
        category: adToEdit.category,
        price: adToEdit.price,
        description: adToEdit.description,
        images: adToEdit.images[0],
      },
    });
  }, [adToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')).token
      : 'none';
    if (!userToken) {
      alert('Login to edit the ad');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/ads/${adToEdit._id}`,
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
      alert('Ad updated successfully');
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === adToEdit._id
            ? {
                ...ad,
                name: state.name,
                category: state.category,
                price: state.price,
                description: state.description,
                images: [state.images],
              }
            : ad
        )
      );
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('Failed to update ad');
    }

    setIsEditOpen(false);
  };

  return (
    <>
      <div className={styles.modal}>
        <button
          className={styles.btnCloseModal}
          onClick={() => setIsEditOpen(false)}
        >
          &times;
        </button>
        <h2 className={styles.modalHeader}>Update Ad</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Choose a Category</label>
            <select
              value={state.category.name}
              onChange={(e) => {
                const selectedCategory = state.categories.find(
                  (category) => category.name === e.target.value
                );
                dispatch({ type: 'SET_CATEGORY', payload: selectedCategory });
              }}
              required
            >
              {state.categories.map((category) => (
                <option key={category._id} value={category.name}>
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
            <label className={styles.label}>Enter an Image URL</label>
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
