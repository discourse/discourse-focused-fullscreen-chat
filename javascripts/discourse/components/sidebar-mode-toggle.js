import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class SidebarModeToggle extends Component {
  @service currentUser;
  @service chatStateManager;
  @service site;
  @service router;

  @tracked currentMode;
  @tracked hideToggle = this.chatStateManager.isDrawerPreferred;

  constructor() {
    super(...arguments);
    this.setDefaultMode();
    this.router.on("routeWillChange", (transition) => {
      this.updateModeBasedOnRoute(transition.to);
    });
  }

  updateModeBasedOnRoute(routeName) {
    if (routeName.name.startsWith("chat.")) {
      this.setChatMode();
    } else {
      if (!this.chatStateManager.isDrawerPreferred) {
        this.setForumMode();
      } else {
        this.removeMode();
      }
    }
  }

  removeMode() {
    const sidebarWrapper = document.querySelector(".sidebar-wrapper");
    sidebarWrapper.classList.remove("chat-mode");
    sidebarWrapper.classList.remove("forum-mode");

    this.currentMode = null;
  }

  setChatMode() {
    const sidebarWrapper = document.querySelector(".sidebar-wrapper");
    sidebarWrapper.classList.add("chat-mode");
    sidebarWrapper.classList.remove("forum-mode");

    this.currentMode = "chat";
  }

  setForumMode() {
    const sidebarWrapper = document.querySelector(".sidebar-wrapper");
    sidebarWrapper.classList.add("forum-mode");
    sidebarWrapper.classList.remove("chat-mode");

    this.currentMode = "forum";
  }

  @action
  setDefaultMode() {
    if (this.chatStateManager.isDrawerPreferred) {
      return (this.currentMode = null);
    }

    if (this.router.currentURL.startsWith("/chat/")) {
      this.setChatMode();
    } else {
      this.setForumMode();
    }
  }

  @action
  toggleMode() {
    if (this.currentMode === "chat") {
      this.setForumMode();
      this.router.transitionTo(this.chatStateManager.lastKnownAppURL);
    } else if (this.currentMode === "forum") {
      this.setChatMode();
      this.router.transitionTo(this.chatStateManager.lastKnownChatURL);
    }
  }
}
