import alertReducer from "../alertReducer";
import { ADD_NEW_ALERT, DELETE_ALERT } from "../../constants";

describe("alertReducer", () => {
  it("adds an alert", () => {
    var action = {
      type: ADD_NEW_ALERT,
      payload: { title: "Error", type: "error", id: 1 },
    };

    var newState = alertReducer({ alerts: [] }, action);

    expect(newState).toStrictEqual({
      alerts: [{ title: "Error", type: "error", id: 1 }],
    });
  });

  it("removes an alert", () => {
    var action = { type: DELETE_ALERT, payload: 1 };

    var newState = alertReducer(
      { alerts: [{ title: "Error", type: "error", id: 1 }] },
      action,
    );

    expect(newState).toStrictEqual({ alerts: [] });
  });
});
