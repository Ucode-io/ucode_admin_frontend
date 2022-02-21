import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "components/Button";
import AddIcon from "@material-ui/icons/Add";

describe("Button", () => {
  it("has correct styles", () => {
    render(
      <Button
        size="medium"
        icon={AddIcon}
        onClick={() => console.log("clicked")}
      >
        Create
      </Button>,
    );

    const btnText = screen.getByText(/Create/i);

    expect(btnText).toBeInTheDocument();
    expect(btnText).toHaveStyle("color: rgb(255 255 255)");
  });

  it("is clickable", () => {
    console.log = jest.fn();
    // var consoleSpy = jest.spyOn(console, "log");
    render(
      <Button
        size="medium"
        icon={AddIcon}
        onClick={() => console.log("clicked")}
      >
        Create
      </Button>,
    );

    const btn = screen.getByText(/Create/i);

    userEvent.click(btn);

    expect(console.log).toHaveBeenCalledWith("clicked");
  });
});
