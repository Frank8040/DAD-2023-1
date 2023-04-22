const Button = ({ onClick, className, title }) => {
    return (
        <button
            className={className}
            onClick={onClick}
        >
            {title}
        </button>
    )
}
export default Button;