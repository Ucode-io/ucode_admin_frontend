import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "components/Button";
import AddIcon from "@material-ui/icons/Add";
import { createMemoryHistory } from "history";

describe("Button", () => {
  it("has correct styles", () => {
    render(
      <Button size="medium" icon={AddIcon}>
        Create
      </Button>,
    );

    var btnText = screen.getByText(/Create/i);

    expect(btnText).toBeInTheDocument();
    expect(btnText).toHaveStyle("color: rgb(255 255 255)");
  });

  it("is clickable", () => {
    var history = createMemoryHistory();

    render(
      <Button
        size="medium"
        icon={AddIcon}
        onClick={() => history.push("/new-page")}
      >
        Create
      </Button>,
    );

    var btn = screen.getByText(/Create/i);

    expect(history.location.pathname).toBe("/");

    userEvent.click(btn);

    expect(history.location.pathname).toBe("/new-page");
  });

  it("switches from disabled to enabled or vice versa", () => {
    var disabled = true;
    render(
      <Button size="medium" icon={AddIcon} disabled={disabled}>
        Create
      </Button>,
    );

    var btn = screen.getByRole("button");

    expect(btn).toBeDisabled();

    setTimeout(() => {
      disabled = false;
    }, 1000);

    setTimeout(() => {
      expect(btn).not.toBeDisabled();
    }, 1000);
  });
});
