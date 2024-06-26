import { PortfolioLink } from "../components"

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {children}
    </div>
  )
}

export function Home() {
  return (
    <div
      style={{
        display: "flex",
        color: "white",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: 800,
      }}
    >
      <Group>
        hi i&apos;m Jaivin (jay-vin), welcome to my very cool and professional
        website that took many hours and countless sleepless nights to build :)
        <br />
        <br />
        get in touch
        <PortfolioLink label="me@jai.vin" link="mailto:me@jai.vin" />
        <PortfolioLink label="cv" link="/cv.pdf" />
      </Group>
      <PortfolioLink label="blog" link="/blog" />
      <Group>
        checkout my cool projects
        <PortfolioLink
          label="Robo Highlights"
          link="https://youtube.com/robohighlights"
          note="2018-2019 a fully automated youtube channel that made highlight videos of top moments from popular twitch streamers. grew to 20k+ subscribers and 10m+ views, 90% without human intervention."
        />
        <PortfolioLink
          label="Waifudex"
          link="https://waifudex.com"
          note="2020- high quality anime/manga database social platform and progress tracker. overarching goal of building an ai that learns from your interests and gives you personalized recommendations for new anime/manga/characters. grew to 66k+ users and 19k+ members in a partnered discord server."
        />
        <PortfolioLink
          label="Sojodex (coming idk when)"
          link="https://sojodex.com"
          note="an on hold dream project"
        />
        <PortfolioLink
          label="spidey.ai"
          link="https://spidey.ai"
          note="makes learning addicting. talk to an ai tutor to learn concepts and turn your homework into a game."
        />
      </Group>
      <Group>
        client work
        <PortfolioLink
          label="Drum to LEARN"
          link="https://drumtolearn.com"
          note="2024 crafted a beautiful frontend, made a new brand identity and logo, made a backend for a class scheduling system and newsletter. finished in 10 days."
        />
      </Group>
      <Group>
        follow my socials
        <PortfolioLink
          label="tiktok"
          link="https://tiktok.com/@jaivinwylde"
          note="made a few viral posts and grew to 110k+ followers and 11.5+ million views."
        />
        <PortfolioLink
          label="youtube"
          link="https://youtube.com/@jaiv"
          note="made a small amount of high effort videos and grew to 3k+ subscribers."
        />
        <PortfolioLink
          label="github"
          link="https://www.github.com/jaivinwylde"
          note="won a hackathon in 2020 for building the algo behind socialsense (see pinned repo), an ai powered tool that predicts the best hashtags to use on instagram."
        />
        <PortfolioLink
          label="reddit"
          link="https://www.reddit.com/u/jaivinwylde"
          note="grew to 14k+ karma and 1m+ total views."
        />
        <PortfolioLink
          label="linkedin"
          link="https://www.linkedin.com/in/jaivin-wylde-20a705195/"
        />
        <PortfolioLink label="x" link="https://x.com/jaivinwylde" />
        <PortfolioLink
          label="instagram"
          link="https://instagram.com/jaivinwylde"
        />
        <PortfolioLink
          label="twitch"
          link="https://www.twitch.com/jaivinwylde"
        />
      </Group>
      © Jaivin Wylde 2003-{new Date().getFullYear()}
      <p style={{ color: "#121212" }}>
        Email me with the subject &quot;re:zero is the best anime ever&quot; to
        get a guaranteed response.
      </p>
    </div>
  )
}
