
import React, { useState } from "react";
import MyContext from "./MyContext";

const MyContextProvider = ({ children }) => {
    const initialVal={
        movie: {
            movie_id: "",
            movie_name: ""
        },
        theater: {
            theater_id: 1,
            theater_name: ""
        },
        seatsSelected: [],
        startTime: "",
        total: 0.00
    }

  const [summary, setSummary] = useState(initialVal);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true); // Track modal visibility
  const [filters, setFilters] = useState({});

  return (
    <MyContext.Provider value={{ summary, setSummary, isLoggedIn, setIsLoggedIn, filters, setFilters, isModalVisible, setIsModalVisible}}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
