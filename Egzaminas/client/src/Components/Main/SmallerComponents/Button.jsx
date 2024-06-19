import styles from "./Button.module.css";

const Button = ({ children, onClick, type, className }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styles[type]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
