const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

async function fetchData(method, url, data = null, headers = {}) {
  try {
    const response = await fetch(BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", // safe for future JWT/cookies
      body: data ? JSON.stringify(data) : undefined,
    });

    const text = await response.text();

    let result;
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      return {
        isSuccess: false,
        message: "Invalid server response",
      };
    }

    if (!response.ok) {
      return {
        isSuccess: false,
        message: result.message || "Request failed",
        status: response.status,
      };
    }

    return result;
  } catch (error) {
    console.error("Error from fetchData:", error);
    return {
      isSuccess: false,
      message: "Server not reachable",
    };
  }
}

export default fetchData;
