import { HTMLAttributes } from 'react'

interface ButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string
  theme?: string
  link: string
}

export default function Button({ theme, label, link, ...props }: ButtonProps) {
  return (
    <a href={link} className={theme} {...props}>
      {label}
    </a>
  )
}
