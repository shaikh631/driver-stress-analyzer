import React from 'react'

function Button({
    children,
    type= 'button',
    bgColor = 'Black',
    textColor = 'text-white',
    padding = 'px-8 py-2',
    borderRadius = 'rounded',
    hoverBg = 'hover:oklch(71.2% 0.194 13.428)',
    className = '',
    ...props
}) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  )
}

export default Button