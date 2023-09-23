/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { List } from './components/List';
import { FilterTodos } from './types/FilterTodos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 11544;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState('');
  const [filtredTodos, setFiltredTodos] = useState(FilterTodos.All);

  useEffect(() => {
    setTodosError('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setTodosError('Unable to download todos');
        throw error;
      });
  }, []);

  useEffect(() => {
    if (todosError) {
      const timeoutId = setTimeout(() => {
        setTodosError('');
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [todosError]);

  const isOneTodoCompleted = useMemo(() => todos
    .some(({ completed }) => completed), [todos]);

  const filterTodos = useMemo(() => todos
    .filter(({ completed }) => {
      switch (filtredTodos) {
        case FilterTodos.Active:
          return !completed;
        case FilterTodos.Completed:
          return completed;
        default:
          return true;
      }
    }), [todos, filtredTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <List filterTodos={filterTodos} />

        {/* Hide the footer if there are no todos */}
        <Footer
          isOneTodoCompleted={isOneTodoCompleted}
          todos={filterTodos}
          filtredTodos={filtredTodos}
          setFiltredTodos={setFiltredTodos}
        />
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {todosError && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hiden: !todosError,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setTodosError('')}
          />
          {todosError}
          {/* show only one message at a time */}
          Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo
        </div>
      )}

    </div>
  );
};
