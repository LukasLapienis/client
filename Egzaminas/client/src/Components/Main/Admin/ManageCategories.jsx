import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../SmallerComponents/Button';
import styles from '../../Header/Modals.module.css';
import Spinner from '../SmallerComponents/Spinner';

export const ManageCategories = ({ setIsManageCategoriesOpen }) => {
  const userToken = JSON.parse(localStorage.getItem('userData')).token;
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const postCategory = (data) => {
    try {
      axios
        .post('http://localhost:5000/api/categories', data, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => getCategories());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const deleteCategories = (id) => {
    try {
      axios
        .delete(`http://localhost:5000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => getCategories());
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySubmit = (ev) => {
    ev.preventDefault();
    const data = { name: newCategory };
    postCategory(data);
    setNewCategory('');
  };
  const handleCatInput = (el) => {
    setNewCategory(el.target.value);
  };
  const handleCategoryDelete = (id) => {
    deleteCategories(id);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className={styles.modal}>
        <button
          className={styles.btnCloseModal}
          onClick={() => setIsManageCategoriesOpen(false)}
        >
          &times;
        </button>
        <h3 className={styles.modalHeader}>Categories</h3>
        <ol>
          {categories.map((e) => (
            <li key={e._id}>
              <span>{e.name}</span>
              <Button type="delete" onClick={() => handleCategoryDelete(e._id)}>
                &times;
              </Button>
            </li>
          ))}
        </ol>
        <form className={styles.categoriesForm} onSubmit={handleCategorySubmit}>
          <input
            className={styles.input}
            type="text"
            value={newCategory}
            onChange={handleCatInput}
            required
          />
          <Button type="submit" className={styles.btn}>
            Add new
          </Button>
        </form>
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};
