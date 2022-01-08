import React from 'react';

const Banner = ({ text, onClick }) => {
  return (
    <div className="banner" onClick={onClick}>
      {text}
    </div>
  )
};

export default Banner;