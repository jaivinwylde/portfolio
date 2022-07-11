import { PortfolioLink } from "../components"

export function Home() {
  return (
    <>
      welcome to my very cool and professional website that took many hours and
      countless sleepless nights to build :)
      <br />
      <br />
      follow my socials
      <PortfolioLink
        label="instagram"
        link="https://instagram.com/jaivinwylde"
      />
      <PortfolioLink label="youtube" link="https://youtube.com/jaivinwylde" />
      <PortfolioLink label="tiktok" link="https://tiktok.com/@jaivinwylde" />
      <PortfolioLink label="twitter" link="https://twitter.com/jaivinwylde" />
      <PortfolioLink
        label="reddit"
        link="https://www.reddit.com/u/jaivinwylde"
      />
      <PortfolioLink
        label="twitch"
        link="https://www.twitch.com/jaivinwylde"
      />
      <br />
      checkout my cool projects
      <PortfolioLink
        label="Robo Highlights"
        link="https://youtube.com/robohighlights"
      />
      <PortfolioLink label="Waifudex" link="https://waifudex.com" />
      <br />
      get in touch
      <PortfolioLink label="me@jai.vin" link="mailto:me@jai.vin" />
      <br />© Jaivin Wylde
    </>
  )
}
