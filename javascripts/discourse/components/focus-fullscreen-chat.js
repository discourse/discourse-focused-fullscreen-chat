import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class FocusFullscreenChat extends Component {
  @service chatStateManager;
  @service router;

  constructor() {
    super(...arguments);
    this.chatStateManager.prefersDrawer(); // override existing preference
    this.router.on("routeWillChange", (route) => {
      this.forceDrawerMode(route.to);
    });
  }

  forceDrawerMode(route) {
    if (route.name.startsWith("chat.")) {
      // when entering full screen chat, we don't want to force the state
      document.querySelector(".sidebar-wrapper").classList.add("focused-chat");
      return;
    } else {
      // when leaving full screen chat, we want to force the state
      document
        .querySelector(".sidebar-wrapper")
        .classList.remove("focused-chat");
      this.chatStateManager.prefersDrawer();
      return;
    }
  }
}
