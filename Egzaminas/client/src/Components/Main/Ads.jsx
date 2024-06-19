import React, { useEffect, useState } from 'react';
import Comments from './SmallerComponents/Comments';
import styles from './Ads.module.css';
import Button from './SmallerComponents/Button';
import Likes from './SmallerComponents/Likes';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { EditAd } from './AllUsers/EditAd';

const Ads = ({
  filterSelectValue,
  filterInputValue,
  adsShowOrder,
  ads,
  setAds,
  showMyFavorites,
  showMyAds,
}) => {
  const [filteredAds, setFilteredAds] = useState([]);
  const [likedAds, setLikedAds] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [adToComment, setAdToComment] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  useEffect(() => {
    const fetchLikedAds = async () => {
      if (userData.token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          };
          const response = await axios.get(
            'http://localhost:5000/api/ads/liked',
            config
          );
          setLikedAds(response.data);
        } catch (error) {
          console.error('Error fetching liked ads:', error);
        }
      }
    };

    fetchLikedAds();
  }, [userData.token]);

  useEffect(() => {
    const filterAndSort = () => {
      let adsCopy = [...ads];

      if (showMyFavorites) {
        adsCopy = adsCopy.filter((ad) =>
          ad.likes.some((user) => user === userData._id)
        );
      }

      if (showMyAds) {
        adsCopy = adsCopy.filter((ad) => ad.user._id === userData._id);
      }

      // Sorting
      if (adsShowOrder === 'low') {
        adsCopy.sort((a, b) => a.price - b.price);
      } else if (adsShowOrder === 'high') {
        adsCopy.sort((a, b) => b.price - a.price);
      }

      // Filtering based on input value and category selection
      return adsCopy.filter((ad) => {
        const matchesCategory =
          filterSelectValue === 'all' || ad.category.name === filterSelectValue;
        const matchesInput =
          ad.name.toLowerCase().includes(filterInputValue.toLowerCase()) ||
          ad.description.toLowerCase().includes(filterInputValue.toLowerCase());
        return matchesCategory && matchesInput;
      });
    };

    setFilteredAds(filterAndSort());
  }, [
    ads,
    filterSelectValue,
    filterInputValue,
    adsShowOrder,
    showMyAds,
    showMyFavorites,
    userData._id,
  ]);

  const handleComments = (id) => {
    const findAdToComment = ads.find((adToComment) => adToComment._id === id);
    setAdToComment(findAdToComment);
    setIsCommentsOpen(true);
  };

  const handleAdUpdate = (id) => {
    const findAdToEdit = ads.find((adToEdit) => adToEdit._id === id);
    setAdToEdit(findAdToEdit);
    setIsEditOpen(true);
  };

  const handleAdDelete = async (id) => {
    const userToken = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')).token
      : 'none';
    if (!userToken) {
      alert('login to delete Ad');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/ads/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Ad deleted successfully');
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.adContainer}>
        {filteredAds.length === 0 ? (
          <h2>No Ads To Show</h2>
        ) : (
          filteredAds.map((ad) => (
            <div key={ad._id} className={styles.singleAd}>
              {ad.images.map((image) => (
                <img key={image} src={image} className={styles.adImage} />
              ))}
              <Likes
                userData={userData}
                ad={ad}
                likedAds={likedAds}
                setLikedAds={setLikedAds}
                setAds={setAds}
              />
              <div className={styles.adContent}>
                <div>
                  <h2>{ad.name}</h2>
                  <div className={styles.manageAdBtns}>
                    {userData._id === ad.user._id && (
                      <Button
                        type="edit"
                        onClick={() => {
                          handleAdUpdate(ad._id);
                        }}
                      >
                        &#9998;
                      </Button>
                    )}
                    {(userData._id === ad.user._id ||
                      userData.role === 'admin') && (
                      <Button
                        type="delete"
                        onClick={() => handleAdDelete(ad._id)}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                  <p className={styles.price}>{ad.price}&euro;</p>
                  <p className={styles.category}>{ad.category.name}</p>

                  <p>{ad.description}</p>
                </div>

                <div className={styles.overallNum}>
                  <p>
                    Likes <FaHeart className={styles.likeNum} />:
                    <span> {ad.likes.length}</span>
                  </p>
                  <p
                    onClick={() => handleComments(ad._id)}
                    className={styles.comments}
                  >
                    Comments: <span>{ad.comments.length}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isCommentsOpen && (
        <Comments
          setIsCommentsOpen={setIsCommentsOpen}
          adToComment={adToComment}
          setAds={setAds}
        />
      )}
      {isEditOpen && (
        <EditAd
          setIsEditOpen={setIsEditOpen}
          adToEdit={adToEdit}
          setAds={setAds}
        />
      )}
    </main>
  );
};

export default Ads;
