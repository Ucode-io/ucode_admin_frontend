import {store} from "../store";
import {showAlert} from "../store/alert/alert.thunk";

const shownErrors = new Set();

export const handleError = (error) => {
  const errorMessage = error || "An unexpected error occurred";

  if (!shownErrors.has(errorMessage)) {
    shownErrors.add(errorMessage);
    store.dispatch(showAlert(errorMessage));
  }

  if (shownErrors.size === 1) {
    setTimeout(() => {
      shownErrors.clear();
    }, 5000);
  }
};
