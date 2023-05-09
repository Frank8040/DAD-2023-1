import Label from "../components/Label";

const Input = ({ onChange, className, type, value, title }) => {
    return (
        <div style={{ display: "grid"}}>
            <Label className="label-name" title={title} />
        
        <input
            className={className}
            onChange={onChange}
            type={type}
            value={value}
        />
        </div>
    )
}
export default Input;