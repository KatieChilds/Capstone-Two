import React, { useState } from "react";

const SearchForm = ({ keyVal, searchFor }) => {
  const [term, setTerm] = useState("");
  const [searchObj, setSearchObj] = useState({
    [keyVal]: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerm(value);
    setSearchObj((obj) => ({
      ...obj,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchFor(searchObj);
    setTerm("");
    setSearchObj({});
  };

  return (
    <div className="form-container">
      <form
        className="search-form"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            id="search"
            name={keyVal}
            value={term}
            placeholder="Search"
            onChange={handleChange}
            aria-describedby="search-btn-addon"
            aria-label="search"
          />
          <button
            className="btn btn-info"
            id="search-btn-addon"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
