import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text} {value}
    </p>
  );
}

const Statistics = ({ good, neutral, bad }) => {
  const getTotal = () => good + neutral + bad;
  const getAverage = () => (good - bad) / getTotal();
  const getPositive = () => (good / getTotal()) * 100;

  const total = getTotal();
  const average = isNaN(getAverage()) ? 0 : getAverage();
  const positive = isNaN(getPositive()) ? 0 : getPositive();
  
  return total === 0 ? (
    <p>No feedback given</p>
  ) : (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive + ' %'} />
    </div>
  );
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

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={addGood} text="good" />
      <Button onClick={addNeutral} text="neutral" />
      <Button onClick={addBad} text="bad" />

      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
