import React, { useState } from 'react';
import './Search.css';

const SearchInput = ({handleChange}) => {
  // const [inputValue, setInputValue] = useState('');

  const handleChangeS = (event) => {
    console.log("event",event.target.value)
    // setInputValue(event.target.value);
  };

  const handleSearch = (e) => {
    // Perform search action here

    // console.log('Search performed:', inputValue);
  };

  return (
    <div className="search-container">
      <div  className="search-main">
     <span className='search_icon'><i className='fa fa-search'></i></span>
      <input
        type="text"
        placeholder="Search..."
        // value={searchValue}
        onChange={handleChange}
        className="search-input"
      />
      </div>
      
    </div>
  );
};

export default SearchInput;
