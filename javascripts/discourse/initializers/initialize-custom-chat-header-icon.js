import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-chat-header-icon",
  initialize() {
    withPluginApi("0.12.1", (api) => {
      api.addToHeaderIcons("custom-chat-header-icon");
    });
  },
};
