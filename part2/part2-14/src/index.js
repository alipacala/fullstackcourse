import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import personService from "./services/persons";

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Numbers = ({ persons, filter, handleDelete }) => {
  return (
    <ul>
      {persons
        .filter(
          (person) =>
            !filter || person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <li key={person.name}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDelete(person)}>delete</button>
          </li>
        ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((_) => alert("Failed to fetch data"));
  }, []);

  const [filter, setFilter] = useState("");

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then((createdPerson) => setPersons(persons.concat(createdPerson)))
      .catch((_) => alert("Failed to create new person"));

    setNewName("");
    setNewNumber("");
    setFilter("");
  };

  const handleDelete = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }

    personService
      .deletePerson(person.id)
      .then(() => setPersons(persons.filter((p) => p.id !== person.id)))
      .catch((_) => alert("Failed to delete person"));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Numbers persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
