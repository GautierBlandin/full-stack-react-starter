import styles from './todo.module.css';

export function Todo() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Todo!</h1>
    </div>
  );
}

export default Todo;
