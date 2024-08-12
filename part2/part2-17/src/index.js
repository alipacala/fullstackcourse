import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import personService from "./services/persons";
import "./index.css";

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      className={
        (messageType === "error" ? "error" : "success") + " notification"
      }
    >
      {message}
    </div>
  );
};

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
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((_) => {
        setMessage("Failed to fetch data from server");
        setMessageType("error");
        setTimeout(() => setMessage(null), 2000);
      });
  }, []);

  const [filter, setFilter] = useState("");

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const person = persons.find((person) => person.name === newName);

    if (person) {
      if (person.number === newNumber) {
        alert(
          `${newName} is already added to phonebook and has the same number`
        );
        return;
      }

      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      }

      const updatedPerson = {
        name: newName,
        number: newNumber,
      };

      personService
        .update(person.id, updatedPerson)
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          );

          setMessage(`Updated ${updatedPerson.name}`);
          setMessageType("success");
          setTimeout(() => setMessage(null), 2000);
        })
        .catch((_) => {
          setMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setMessageType("error");
          setTimeout(() => setMessage(null), 2000);
          setPersons(persons.filter((p) => p.id !== person.id));
        });

      setNewName("");
      setNewNumber("");
      setFilter("");

      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService
      .create(newPerson)
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson));

        setMessage(`Added ${createdPerson.name}`);
        setMessageType("success");
        setTimeout(() => setMessage(null), 2000);
      })
      .catch((_) => {
        setMessage("Failed to create new person");
        setMessageType("error");
        setTimeout(() => setMessage(null), 2000);
      });

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
      .catch((_) => {
        setMessage(`Person '${person.name}' was already removed from server`);
        setMessageType("error");

        setTimeout(() => {
          setMessage(null);
        }, 2000);
        setPersons(persons.filter((p) => p.id !== person.id));
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
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
