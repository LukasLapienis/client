import axios from "axios";
import React, { useEffect, useState } from "react";
import Comments from "./SmallerComponents/Comments";
import styles from "./Filter.module.css";

const Filter = ({
  filterInputValue,
  setfilterInputValue,
  setfilterSelectValue,
  setAdsShowOrder,
}) => {
  const [categories, setcategories] = useState([]);

  const getCategories = () => {
    try {
      axios
        .get("http://localhost:5000/api/categories")
        .then((res) => setcategories(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const selectChange = (el) => {
    setfilterSelectValue(el.target.value);
  };

  const inputChange = (e) => {
    setfilterInputValue(e.target.value);
  };
  const sortSelectChange = (e) => {
    setAdsShowOrder(e.target.value);
  };

  return (
    <>
      <h1>
        Welcome to the
        <span className={styles.highlight}> AdVantage </span> page, create and
        upload your ads completely for free !
      </h1>
      <div className={styles.container}>
        <div>
          <input
            type="text"
            placeholder="Search"
            onChange={inputChange}
            value={filterInputValue}
          />
          <label htmlFor="categories">Categories: </label>
          <select id="categories" onChange={selectChange}>
            <option value="all">all</option>
            {categories.map((cate) => (
              <option key={cate.name} value={cate.name}>
                {cate.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort">Price order: </label>
          <select id="sort" onChange={sortSelectChange}>
            <option value="default" disabled>
              --Choose--
            </option>
            <option value="low">Lower price</option>
            <option value="high">Higher price</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Filter;
