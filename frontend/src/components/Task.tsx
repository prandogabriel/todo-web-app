import React from 'react';

type TaskType = {
  id: string;
  name: string;
};

type Props = {
  task: TaskType;
};

export default function Task({ task }: Props) {
  return (
    <li className="text-gray-600 dark:text-gray-300">- {task.name}</li>
  );
}
