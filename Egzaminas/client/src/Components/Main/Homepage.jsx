import { useEffect, useState } from 'react';
import Filter from './Filter';
import Navigation from '../Header/Navigation';
import Admin from './Admin/Admin';
import Ads from './Ads';
import Footer from '../Footer/Footer';
import AllUsers from './AllUsers/AllUsers';
import axios from 'axios';
import styles from './Homepage.module.css';

function App() {
  const [ads, setAds] = useState([]);
  const [filterSelectValue, setfilterSelectValue] = useState('all');
  const [filterInputValue, setfilterInputValue] = useState('');
  const [adsShowOrder, setAdsShowOrder] = useState('default');
  const [showMyAds, setShowMyAds] = useState(false);
  const [showMyFavorites, setShowMyFavorites] = useState(false);
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')).role
      : 'none'
  );

  useEffect(() => {
    const getAds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ads');
        setAds(res.data);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    getAds();
  }, []);

  return (
    <>
      <Navigation setUserRole={setUserRole} />
      <Filter
        filterInputValue={filterInputValue}
        setfilterInputValue={setfilterInputValue}
        setfilterSelectValue={setfilterSelectValue}
        setAdsShowOrder={setAdsShowOrder}
      />
      {userRole !== 'none' ? (
        <>
          <div className={styles.usersContainer}>
            <AllUsers
              setAds={setAds}
              setShowMyAds={setShowMyAds}
              setShowMyFavorites={setShowMyFavorites}
            />
            {userRole === 'admin' ? (
              <>
                <Admin />
              </>
            ) : null}
          </div>
        </>
      ) : null}
      <Ads
        ads={ads}
        setAds={setAds}
        filterSelectValue={filterSelectValue}
        filterInputValue={filterInputValue}
        adsShowOrder={adsShowOrder}
        showMyAds={showMyAds}
        showMyFavorites={showMyFavorites}
      />
      <Footer />
    </>
  );
}

export default App;
