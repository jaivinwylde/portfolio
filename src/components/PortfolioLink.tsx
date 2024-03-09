interface PortfolioLinkProps {
  label: string
  link: string
  note?: string
}

export function PortfolioLink({ label, link, note }: PortfolioLinkProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <a
        style={{ color: "#4393bf" }}
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
      {note && (
        <p style={{ color: "#888", fontSize: 14, margin: 0 }}>{note}</p>
      )}
    </div>
  )
}
