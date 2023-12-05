import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const MostVoted = ({ anecdotes, votes }) => {
  const mostVotes = Math.max(...votes);
  const mostVotedIndex = votes.indexOf(mostVotes);
  return mostVotes === 0 ? (
    <p>No votes yet</p>
  ) : (
    <div>
      <p>{anecdotes[mostVotedIndex]}</p>
      <p>has {mostVotes} votes</p>
    </div>
  );
};

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleNext = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const handleVote = () => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    setVotes(votesCopy);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <Button onClick={handleNext} text="next anecdote" />
      <Button onClick={handleVote} text="vote" />

      <h1>Anecdote with most votes</h1>
      <MostVoted anecdotes={anecdotes} votes={votes} />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App anecdotes={anecdotes} />
  </React.StrictMode>
);
