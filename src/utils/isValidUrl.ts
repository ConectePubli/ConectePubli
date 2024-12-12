export const isValidURL = (url: string) => {
  try {
    const testUrl = url.includes("://") ? url : "http://" + url;
    new URL(testUrl);
    return true;
  } catch (e) {
    console.log(`invalid url ${e}`);
    return false;
  }
};
