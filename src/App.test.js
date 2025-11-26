import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MIA Retail app", () => {
  render(<App />);
  const brandElement = screen.getByText("MIA Retail", {
    selector: ".brand-text",
  });
  expect(brandElement).toBeInTheDocument();
});
