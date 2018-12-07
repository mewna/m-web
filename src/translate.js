import enUS from "./locale/en_US.json";

export default key => {
  const split = key.split(".");
  try {
    let target = enUS;
    for (const s of split) {
      target = target[s];
    }
    return target;
  } catch (e) {
    return "[Unknown translation]";
  }
};
