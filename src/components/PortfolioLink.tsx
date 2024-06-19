interface PortfolioLinkProps {
  label: string
  link: string
  note?: string
}

export function PortfolioLink({ label, link, note }: PortfolioLinkProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <a
        style={{ color: "#4393bf", fontWeight: 700 }}
        href={link}
        target={link.startsWith("https") ? "_blank" : undefined}
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
