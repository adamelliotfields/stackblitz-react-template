import { Router } from "wouter";

import Main from "@/components/Main";

export default function App() {
  return (
    <Router base="/">
      <Main />
    </Router>
  );
}
