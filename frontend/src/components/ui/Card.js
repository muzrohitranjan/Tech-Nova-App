function Card({ className = '', interactive = false, children, ...props }) {
  const cardClassName = `card ${interactive ? 'card-interactive' : ''} ${className}`.trim()

  return (
    <article className={cardClassName} {...props}>
      {children}
    </article>
  )
}

export default Card