const Constants = require("./constants");

const secondbrainApps = [
  {
    key: Constants.appKeys.sb, // SECONDBRAIN
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/personal?maxRecords=1000&view=Grid%20view"
  },
  {
    key: Constants.appKeys.rmed, // RAMANA_MAHARISHI_ENGLISH_DAILY
    token: "key34bOupUaggtKkP",
    uri:
      "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/ramanamaharishidaily?maxRecords=1000&view=Grid%20view"
  }
  // {
  //   key: Constants.appKeys.aed, // ADVAITA_ENGLIGH_DAILY
  //   token: "key34bOupUaggtKkP",
  //   uri:
  //     "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/advaitadaily?maxRecords=1000&view=Grid%20view"
  // },
  // {
  //   key: Constants.appKeys.ted, // TAO_ENGLIGH_DAILY
  //   token: "key34bOupUaggtKkP",
  //   uri:
  //     "https://api.airtable.com/v0/appfE7KsVoV5uiRhK/taodaily?maxRecords=1000&view=Grid%20view"
  // }
];

module.exports = secondbrainApps;
