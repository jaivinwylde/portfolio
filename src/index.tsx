import { App } from "./App"
import "./App.css"

import React from "react"
import { render } from "react-dom"

// const body = document.querySelector("body") as any
// body.style.backgroundColor = "#121212"

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
