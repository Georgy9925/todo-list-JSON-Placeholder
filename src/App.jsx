import { useEffect, useState } from 'react';
import styles from './app.module.css';

const API_URL = 'http://localhost:3001/todos';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newTodoTitle, setNewTodoTitle] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortAlphabetically, setSortAlphabetically] = useState(false);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = () => {
		setIsLoading(true);
		fetch('http://localhost:3001/todos')
			.then((response) => response.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			})
			.catch((error) => {
				console.error('Ошибка при загрузке:', error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleAddTodo = () => {
		if (!newTodoTitle.trim()) return;

		const newTodo = {
			title: newTodoTitle.trim(),
			completed: false
		};

		fetch('http://localhost:3001/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newTodo),
		})
			.then((response) => response.json())
			.then((createdTodo) => {
				setTodos([...todos, createdTodo]);
				setNewTodoTitle('');
			})
			.catch((error) => {
				console.error('Ошибка при добавлении:', error);
			});
	};

	const handleToggleComplete = (id, completed) => {
		fetch(`http://localhost:3001/todos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ completed: !completed }),
		})
			.then((response) => response.json())
			.then((updatedTodo) => {
				setTodos(todos.map(todo =>
					todo.id === id ? updatedTodo : todo
				));
			})
			.catch((error) => {
				console.error('Ошибка при обновлении:', error);
			});
	};

	const handleDeleteTodo = (id) => {
		fetch(`http://localhost:3001/todos/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				setTodos(todos.filter(todo => todo.id !== id));
			})
			.catch((error) => {
				console.error('Ошибка при удалении:', error);
			});
	};

	const filteredTodos = todos.filter(todo =>
		todo.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const sortedTodos = sortAlphabetically
		? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTodos;

	return (
		<div className={styles.app}>
			<div className={styles.header}>
				<h1>Todo List</h1>
				<p>Список дел с JSON Server</p>
			</div>

			{ }
			<div className={styles.controls}>
				<input
					type="text"
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					placeholder="Добавить новое дело..."
					className={styles.input}
					onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
				/>
				<button
					onClick={handleAddTodo}
					className={styles.addButton}
					disabled={!newTodoTitle.trim()}
				>
					Добавить
				</button>
			</div>

			<div className={styles.controls}>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Поиск дел..."
					className={styles.input}
				/>
				<button
					onClick={() => setSortAlphabetically(!sortAlphabetically)}
					className={styles.sortButton}
				>
					{sortAlphabetically ? 'Сбросить сортировку' : 'Сортировать по А-Я'}
				</button>
			</div>

			{isLoading ? (
				<div className={styles.loader}>Загрузка...</div>
			) : (
				<div className={styles.todoList}>
					{sortedTodos.map(({ id, title, completed }) => (
						<div key={id} className={styles.todoItem}>
							<input
								type="checkbox"
								checked={completed}
								onChange={() => handleToggleComplete(id, completed)}
								className={styles.checkbox}
							/>
							<div className={styles.todoContent}>
								<h3 className={completed ? styles.completed : ''}>
									{title}
								</h3>
								<p className={styles.todoId}>ID: {id}</p>
							</div>
							<div className={completed ? styles.statusCompleted : styles.statusPending}>
								{completed ? 'Выполнено' : 'В процессе'}
							</div>
							<button
								onClick={() => handleDeleteTodo(id)}
								className={styles.deleteButton}
							>
								Удалить
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
