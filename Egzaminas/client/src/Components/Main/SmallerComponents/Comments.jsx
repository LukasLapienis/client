import React, { useState, useEffect } from 'react';
import styles from '../../Header/Modals.module.css';
import axios from 'axios';
import Button from './Button';

const Comments = ({ setIsCommentsOpen, adToComment, setAds }) => {
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState('');
  const userData = localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null;

  const getComments = async () => {
    try {
      const comments = await axios.get(
        `http://localhost:5000/api/comments/ad/`,
        { params: { adId: adToComment._id } }
      );
      setAllComments(comments.data.data);
      console.log(comments.data.data);
    } catch (error) {
      console.error('Error fetching Comments:', error);
      alert('Failed to fetch Comments');
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!userData) {
      alert('login to Comment an Ad');
      return;
    }
    const createComment = async () => {
      const generateTimestampId = () => {
        const timestamp = Date.now().toString(16);
        return timestamp.padStart(24, '0');
      };
      const timestampId = generateTimestampId();

      try {
        await axios.post(
          'http://localhost:5000/api/comments',
          {
            comment: comment,
            adId: adToComment._id,
            _id: timestampId,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Comment created successfully');
        setAllComments((prev) => [
          ...prev,
          {
            comment: comment,
            adId: adToComment._id,
            _id: timestampId,
            user: userData,
          },
        ]);
        setAds((prevAds) =>
          prevAds.map((ad) =>
            ad._id === adToComment._id
              ? { ...ad, comments: [...ad.comments, timestampId] }
              : ad
          )
        );
      } catch (error) {
        console.error('Error creating Comment:', error);
        alert('Failed to create Comment');
      }
    };
    createComment();
    setComment('');
  };

  const handleDeleteComment = async (id) => {
    if (!userData) {
      alert('login to delete Ad');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Comment deleted successfully');
      setAllComments((prev) => prev.filter((comment) => comment._id !== id))
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <button
          className={styles.btnCloseModal}
          onClick={() => setIsCommentsOpen(false)}
        >
          &times;
        </button>
        <div className={styles.comments}>
          {allComments.length > 0 ? (
            allComments.map((comment) => (
              <div key={comment._id} className={styles.comment}>
                <p className={styles.username}>{comment.user.username}</p>
                <p> {comment.comment}</p>
                {console.log(comment)}
                {(userData._id === comment.user._id || userData._id === adToComment.user._id) && (
                  <p className={styles.delete}>
                    <Button
                        type="delete"
                        onClick={() => {
                          handleDeleteComment(comment._id);
                        }}
                      >
                        &times;
                    </Button>
                  </p>
                    )}
              </div>
            ))
          ) : (
            <h2>No Comments yet</h2>
          )}
        </div>
        {userData && (
          <form className={styles.modalForm} onSubmit={handleCommentSubmit}>
            <div className={styles.inputContainer}>
              <label className={styles.label}>Enter Your Comment</label>
              <input
                className={styles.input}
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <Button type="submit">
              Submit
            </Button>
          </form>
        )}
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};

export default Comments;
