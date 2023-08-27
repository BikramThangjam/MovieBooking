
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
        total: ""
    }
  const [summary, setSummary] = useState(initialVal);

  return (
    <MyContext.Provider value={{ summary, setSummary }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
