import { PortfolioLink } from "../../components"

function Post({
  title,
  date,
  slug,
}: {
  title: string
  slug: string
  date: string
}) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
      <PortfolioLink label={title} link={`/blog/${slug}`} note={date} />
    </div>
  )
}

export function Blog() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Post
        title="hashtag ranking algorithm"
        slug="socialsense"
        date="6-19-2024"
      />
    </div>
  )
}
