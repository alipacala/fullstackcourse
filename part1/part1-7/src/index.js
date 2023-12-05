import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addGood = () => {
    setGood(good + 1);
  };
  const addNeutral = () => {
    setNeutral(neutral + 1);
  };
  const addBad = () => {
    setBad(bad + 1);
  };

  const getTotal = () => good + neutral + bad;
  const getAverage = () => (good - bad) / getTotal();
  const getPositive = () => (good / getTotal()) * 100;

  const total = getTotal();
  const average = isNaN(getAverage()) ? 0 : getAverage();
  const positive = isNaN(getPositive()) ? 0 : getPositive();

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={addGood} text="good" />
      <Button onClick={addNeutral} text="neutral" />
      <Button onClick={addBad} text="bad" />

      <h1>statistics</h1>

      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
