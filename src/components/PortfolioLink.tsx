interface PortfolioLinkProps {
  label: string
  link: string
}

export function PortfolioLink({ label, link }: PortfolioLinkProps) {
  return (
    <div>
      <a href={link} target="_blank" rel="noreferrer">
        {label}
      </a>
    </div>
  )
}
