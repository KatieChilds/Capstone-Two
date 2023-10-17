import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue = null) => {
  const initialValue =
    localStorage.getItem(key) || defaultValue;
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    if (state === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, state);
    }
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorage;
