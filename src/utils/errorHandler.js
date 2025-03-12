import {store} from "../store";
import {showAlert} from "../store/alert/alert.thunk";

const shownErrors = new Set();

export const handleError = (error) => {
  const errorMessage = error || "An unexpected error occurred";

  console.log("Current Errors:", shownErrors);

  if (!shownErrors.has(errorMessage)) {
    shownErrors.add(errorMessage);
  }

  Array.from(shownErrors).forEach((err) => store.dispatch(showAlert(err)));

  setTimeout(() => {
    shownErrors.clear();
  }, 5000);
};
