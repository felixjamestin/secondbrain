import { CONFIG } from "../config/Index";

class LogService {
  static loggingType = {
    local: "local",
    remote: "remote"
  };

  static log(value, variableName, calleeName, type = this.loggingType.local) {
    if (CONFIG.LOGGING_ENABLED === false) return;

    switch (type) {
      case this.loggingType.local:
        this._logLocally(
          "In method " + calleeName + " for variable " + variableName
        );
        this._logLocally(value);
        break;

      case this.loggingType.remote:
        this._logRemotely(
          "In method " + calleeName + " for variable " + variableName
        );
        this._logRemotely(value);
        break;
    }
  }

  /*--------------------------------------------------
    ⭑ Private methods
  ----------------------------------------------------*/
  static _logLocally(value) {
    console.log(value);
  }

  static _logRemotely(value) {
    let timestamp = new Date();
    let body = {
      lines: [
        {
          app: timestamp,
          timestamp: timestamp,
          line: value
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
