import React from "react";
import ReactDOM from "react-dom/client";

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  );
}

const Content = (props) => {
  return (
    <>
      {props.parts.map((part) => (
        <Part part={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.parts.reduce((acc, part) => acc + part.exercises, 0)}
    </p>
  );
};

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
