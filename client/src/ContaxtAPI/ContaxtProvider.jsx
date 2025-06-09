import React, { useEffect, useState } from "react";
import MyContaxt from "./MyContaxt";
import API from "../API/Api";

const ContaxtProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [questionsData, setQuestionData] = useState([]);
  console.log(questionsData)

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await API.get("/quiz");
      console.log("Full response:", res);
      const { data } = res;
      console.log("Quiz data:", data);

      // Adjust depending on how data is structured
      setQuestionData(data);
    } catch (err) {
      console.log("Fetch error:", err);
      alert("Error while getting the quiz data");
    }
  };

  fetchData();
}, []);





  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users) {
      setUsers(users);
    }
  }, []);


  
  return (
    <MyContaxt.Provider value={{ users, setUsers, questionsData }}>
      {children}
    </MyContaxt.Provider>
  );
};

export default ContaxtProvider;
