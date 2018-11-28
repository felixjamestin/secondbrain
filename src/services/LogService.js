class LogService {
  static getRandomStringFromArray(strings = []) {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
  }

  static log(string) {
    let timestamp = new Date();
    let body = {
      lines: [
        {
          timestamp: timestamp,
          line: "From SB APP: " + string
        }
      ]
    };

    fetch("https://logs.logdna.com/logs/ingest?hostname=secondbrain", {
      method: "post",
      headers: {
        Authorization: "Basic NDc3Mjg3OWU2NmE5Y2U1Njg4Y2VkMzQxMjdhNTAwZWQ6",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }
}

export { LogService };