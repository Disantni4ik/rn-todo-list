import type { Todo } from '../types';

const API_URL = "http://localhost:3000/todos";

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Помилка завантаження завдань: ${response.statusText}`);
  }
  return response.json();
};

export const addTodo = async (text: string): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      completed: false,
      createdAt: Date.now(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Помилка створення завдання: ${response.statusText}`);
  }
  return response.json();
};

export const toggleTodo = async (id: string, completed: boolean): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(`Помилка оновлення статусу: ${response.statusText}`);
  }
  return response.json();
};

export const updateTodoText = async (id: string, text: string): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Помилка оновлення тексту: ${response.statusText}`);
  }
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Помилка видалення завдання: ${response.statusText}`);
  }
};
