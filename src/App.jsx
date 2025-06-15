import { useState } from 'react'
import styles from './app.module.css'

export const App = () => {
	const [value, setValue] = useState('');
	const [list, setList] = useState([]);
	const [error, setError] = useState('');

	const isValueValid = value.length >= 3;

	const onInputButtonClick = () => {
		const promptValue = prompt('Ввести новое');
		setValue(promptValue);

		if (promptValue.length < 3) {
			setError('Введите минимум 3 символа')

		} else {
			setValue(promptValue);
			setError('')
		}
	}

	const onAddButtonClick = () => {
		if (isValueValid) {
			const newId = Date.now()
			const updatedList = [...list, { id: newId, value: value }]
			setList(updatedList)
		};

		setValue('');
		setError('')
	}



	return (
		<div className="app">
			<h1 className={styles["page-heading"]}>Ввод значения</h1>
			<p className={styles["no-margin-text"]}>
				Текущее значение <code>value</code>: "<output className={styles["current-value"]}>{value}</output>"
			</p>
			{error && <div className={styles.error}>Введенное значение должно содержать минимум 3 символа</div>}
			<div className={styles["buttons-container"]}>
				<button className={styles.button} onClick={onInputButtonClick}>Ввести новое</button>
				<button className={styles.button} onClick={onAddButtonClick} disabled={!isValueValid}>Добавить в список</button>
			</div>
			<div className={styles["list-container"]}>
				<h2 className={styles["list-heading"]}>Список:</h2>
				{list.length === 0 ? (<p className={styles["no-margin-text"]}>Нет добавленных элементов</p>
				) : (
					<ul className={styles.list}>
						{list.map(item => (
							<li key={item.id} className={styles["list-item"]}>
								{item.value}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>)
}

