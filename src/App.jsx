import { useEffect, useState } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos.slice(0, 10));
			})
			.finally(() => setIsLoading(false));
	}, []);

	const handleToggleComplete = (id) => {
		setTodos(todos.map(todo =>
			todo.id === id
				? { ...todo, completed: !todo.completed }
				: todo
		));
	};

	return (
		<div className={styles.app}>
			<div className={styles.header}>
				<h1>Todo List</h1>
				<p>Список дел из JSON Placeholder</p>
			</div>

			{isLoading ? (
				<div className={styles.loader}>Загрузка...</div>
			) : (
				<div className={styles.todoList}>
					{todos.map(({ id, title, completed }) => (
						<div key={id} className={styles.todoItem}>
							<input
								type="checkbox"
								checked={completed}
								onChange={() => handleToggleComplete(id)}
								className={styles.checkbox}
							/>
							<div className={styles.todoContent}>
								<h3 className={completed ? styles.completed : ''}>
									{title}
								</h3>

							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
