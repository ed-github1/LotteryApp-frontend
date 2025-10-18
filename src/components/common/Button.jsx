import React from 'react'

const Button = ({ children, onClick, type = 'button', className = '', ...rest }) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button