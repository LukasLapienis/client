import React, { useState } from 'react';
import ManageUsers from './ManageUsers';
import Button from '../SmallerComponents/Button';
import styles from './Admin.module.css';
import { ManageCategories } from './ManageCategories';

const Admin = () => {
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Button onClick={() => setIsManageUsersOpen(true)} type="show">
        Users
      </Button>
      <Button onClick={() => setIsManageCategoriesOpen(true)} type="show">
        Categories
      </Button>

      {isManageUsersOpen && (
        <ManageUsers setIsManageUsersOpen={setIsManageUsersOpen} />
      )}
      {isManageCategoriesOpen && (
        <ManageCategories
          setIsManageCategoriesOpen={setIsManageCategoriesOpen}
        />
      )}
    </div>
  );
};

export default Admin;
