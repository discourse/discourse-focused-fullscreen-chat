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
      return;
    } else {
      // force the drawer state on other routes
      this.chatStateManager.prefersDrawer();
      return;
    }
  }
}
