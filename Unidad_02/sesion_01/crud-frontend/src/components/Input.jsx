const Input = ({ onChange, className, type, value }) => {
    return (
        <input
            className={className}
            onChange={onChange}
            type={type}
            value={value}
        />
    )
}
export default Input;