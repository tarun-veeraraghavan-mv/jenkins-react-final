import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom";

import App from "../../src/App";

describe("App", () => {
  it("should render 'Hello World'", () => {
    render(<App />);

    const text = screen.getByText(/hello world/i);
    expect(text).toBeInTheDocument();
  });
});
