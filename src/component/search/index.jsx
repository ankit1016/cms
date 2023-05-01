import React from 'react';
import './Search.css';

const SearchInput = ({handleChange}) => {
  // const [inputValue, setInputValue] = useState('');

 

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
