import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import Calculator from "./Calculator";

beforeEach(() => {
  render(<Calculator />);
});

// RTL only auto-cleans when using globals like Jest
afterEach(() => {
  cleanup();
});

describe("Calculator", () => {
  test("renders with initial state", () => {
    const display = screen.getByTestId("calculator-display");
    const select = screen.getByRole("combobox");
    expect(display.textContent).toBe("0"); // initial value
    expect(select.textContent).toBe("Scientific"); // default mode
  });

  test("inputs numbers", async () => {
    const display = screen.getByTestId("calculator-display");
    const button1 = screen.getByRole("button", { name: "1" });
    const button2 = screen.getByRole("button", { name: "2" });
    const buttonC = screen.getByRole("button", { name: "C" });
    expect(buttonC.textContent).toBe("C");
    await userEvent.click(button1);
    await userEvent.click(button2);
    expect(display.textContent).toBe("12");
    expect(buttonC.textContent).toBe("CE");
    await userEvent.click(buttonC);
    expect(display.textContent).toBe("0");
    expect(buttonC.textContent).toBe("C");
  });

  test("adds numbers", async () => {
    const display = screen.getByTestId("calculator-display");
    const button1 = screen.getByRole("button", { name: "1" });
    const button2 = screen.getByRole("button", { name: "2" });
    const buttonC = screen.getByRole("button", { name: "C" });
    const buttonPlus = screen.getByRole("button", { name: "+" });
    const buttonEquals = screen.getByRole("button", { name: "=" });
    await userEvent.click(button1);
    await userEvent.click(buttonPlus);
    await userEvent.click(button2);
    await userEvent.click(buttonEquals);
    expect(display.textContent).toBe("3"); // 1 + 2 = 3
    await userEvent.click(buttonPlus);
    await userEvent.click(button1);
    await userEvent.click(buttonC);
    await userEvent.click(button2);
    await userEvent.click(buttonEquals);
    expect(display.textContent).toBe("5"); // 3 + 2 = 5
    await userEvent.click(buttonPlus);
    await userEvent.click(button1);
    await userEvent.click(buttonC);
    await userEvent.click(buttonEquals); // 5 + 0 = 5
    expect(display.textContent).toBe("5");
  });

  test("handles degrees and radians", async () => {
    const buttonDeg = screen.getByRole("button", { name: "DEG" });
    expect(buttonDeg.textContent).toBe("DEG");
    await userEvent.click(buttonDeg);
    expect(buttonDeg.textContent).toBe("RAD");
    await userEvent.click(buttonDeg);
    expect(buttonDeg.textContent).toBe("DEG");
  });

  test("handles division by zero", async () => {
    const display = screen.getByTestId("calculator-display");
    const button0 = screen.getByRole("button", { name: "0" });
    const buttonDivide = screen.getByRole("button", { name: "÷" });
    const buttonEquals = screen.getByRole("button", { name: "=" });
    await userEvent.click(button0);
    await userEvent.click(buttonDivide);
    await userEvent.click(button0);
    await userEvent.click(buttonEquals);
    expect(display.textContent).toBe("ERROR");
  });
});
