import React, { useState } from "react";
import { CreateAd } from "./CreateAd";
import Button from "../SmallerComponents/Button";

const Simple = ({ setAds, setShowMyAds, setShowMyFavorites }) => {
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  return (
    <>
      <Button
        type="show"
        onClick={() => {
          setShowMyAds(false);
          setShowMyFavorites(false);
        }}
      >
        All Ads
      </Button>
      <Button type="show" onClick={() => setIsCreateAdOpen(true)}>
        Create Ad
      </Button>
      <Button
        type="show"
        onClick={() => {
          setShowMyFavorites(false);
          setShowMyAds(true);
        }}
      >
        my Ads
      </Button>
      <Button
        type="show"
        onClick={() => {
          setShowMyAds(false);
          setShowMyFavorites(true);
        }}
      >
        My Favorites
      </Button>
      {isCreateAdOpen && (
        <CreateAd setAds={setAds} setIsCreateAdOpen={setIsCreateAdOpen} />
      )}
    </>
  );
};

export default Simple;
