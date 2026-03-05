function TextAreaField({ id, label, helper, className = '', ...props }) {
  return (
    <label className={`field ${className}`.trim()} htmlFor={id}>
      <span className="field-label">{label}</span>
      <textarea id={id} className="field-input field-textarea" {...props} />
      {helper && <small className="field-helper">{helper}</small>}
    </label>
  )
}

export default TextAreaField