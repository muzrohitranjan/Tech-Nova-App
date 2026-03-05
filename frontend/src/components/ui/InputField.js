function InputField({ id, label, helper, className = '', ...props }) {
  return (
    <label className={`field ${className}`.trim()} htmlFor={id}>
      <span className="field-label">{label}</span>
      <input id={id} className="field-input" {...props} />
      {helper && <small className="field-helper">{helper}</small>}
    </label>
  )
}

export default InputField