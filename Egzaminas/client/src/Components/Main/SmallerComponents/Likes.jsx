import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Likes = ({ userData, ad, likedAds, setLikedAds, setAds }) => {
  const [isLiked, setIsLiked] = useState(false);

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
          const likedAdIds = response.data.map((likedAd) => likedAd._id);
          setIsLiked(likedAdIds.includes(ad._id));
        } catch (error) {
          console.error('Error fetching liked ads:', error);
        }
      }
    };

    fetchLikedAds();
  }, [userData.token, ad._id]);

  const handleLike = async (adId) => {
    try {
      setIsLiked(!isLiked);

      const newLikedAds = { ...likedAds };
      const userId = userData._id;

      if (newLikedAds[adId]) {
        delete newLikedAds[adId][userId];
      } else {
        if (!newLikedAds[adId]) {
          newLikedAds[adId] = {};
        }
        newLikedAds[adId][userId] = true;
      }

      setLikedAds(newLikedAds);

      const token = userData?.token;

      if (!token) {
        throw new Error('No token');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `http://localhost:5000/api/ads/${adId}/like`,
        {},
        config
      );

      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === adId
            ? {
                ...ad,
                likes: isLiked
                  ? ad.likes.filter((like) => like !== userId)
                  : [...ad.likes, userId],
              }
            : ad
        )
      );
    } catch (error) {
      console.error('Error:', error);
      // setIsLiked((prevIsLiked) => !prevIsLiked);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: '24px',
        top: '24px',
      }}
    >
      {userData.token ? (
        <i onClick={() => handleLike(ad._id)}>
          {isLiked ? (
            <FaHeart style={{ width: '25px', height: '25px', color: 'red' }} />
          ) : (
            <FaRegHeart
              style={{ width: '25px', height: '25px', color: 'red' }}
            />
          )}
        </i>
      ) : null}
    </div>
  );
};

export default Likes;
