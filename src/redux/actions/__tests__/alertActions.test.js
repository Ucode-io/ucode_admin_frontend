import { ADD_NEW_ALERT, DELETE_ALERT } from "redux/constants";
import { addAlert, deleteAlert } from "../alertActions";

describe("add a new alert action creator", () => {
  it("has the correct type", () => {
    var action = addAlert("Error", "error", 1);
    expect(action.type).toBe(ADD_NEW_ALERT);
  });

  it("has the correct payload", () => {
    var action = addAlert("Success", "success", 1);
    expect(action.payload).toEqual({
      title: "Success",
      type: "success",
      id: 1,
    });
  });
});

describe("delete an alert action creator", () => {
  it("has the correct type", () => {
    var action = deleteAlert(1);
    expect(action.type).toBe(DELETE_ALERT);
  });

  it("has the correct payload", () => {
    var action = deleteAlert(1);
    expect(action.payload).toBe(1);
  });
});
