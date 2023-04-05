import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { next } from "@ember/runloop";

export default class SidebarModeToggle extends Component {
  @service currentUser;
  @service chatStateManager;
  @service site;
  @service router;
  @service topicTrackingState;

  @tracked unreadTopicCount;
  @tracked currentMode;

  constructor() {
    super(...arguments);
    this.router.on("routeWillChange", (transition) => {
      this.updateModeBasedOnRoute(transition.to);
    });

    this.callbackId = this.topicTrackingState.onStateChange(() => {
      this.updateUnreadTopicCount();
    });
  }

  willDestroy() {
    this.topicTrackingState.offStateChange(this.callbackId);
  }

  get currentUserInDnD() {
    return this.currentUser.isInDoNotDisturb();
  }

  @action
  updateUnreadTopicCount() {
    this.unreadTopicCount = this.topicTrackingState.countUnread();
  }

  updateModeBasedOnRoute(routeName) {
    if (routeName.name.startsWith("chat.")) {
      this.updateSidebarWrapper("chat");
    } else {
      document
        .querySelector(".sidebar-wrapper")
        .classList.remove(this.currentMode + "-mode");
    }
  }

  updateSidebarWrapper(newMode) {
    const sidebarWrapper = document.querySelector(".sidebar-wrapper");
    sidebarWrapper.classList.remove(this.currentMode + "-mode");
    sidebarWrapper.classList.add(newMode + "-mode");
    next(() => {
      this.currentMode = newMode;
    });
  }

  @action
  setDefaultMode() {
    const isChatRoute = this.router.currentURL.startsWith("/chat/");
    const defaultMode = isChatRoute ? "chat" : "forum";
    this.updateSidebarWrapper(defaultMode);
  }

  @action
  toggleMode() {
    if (this.currentMode === "chat") {
      this.updateSidebarWrapper("forum");
      if (settings.back_mode) {
        this.router.transitionTo(
          this.chatStateManager.lastKnownAppURL.includes("/chat/")
            ? "/latest"
            : this.chatStateManager.lastKnownAppURL
        );
      }
    } else {
      this.updateSidebarWrapper("chat");
    }
  }
}
