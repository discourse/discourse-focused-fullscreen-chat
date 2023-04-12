import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class CustomChatHeaderIcon extends Component {
  @service currentUser;
  @service chatStateManager;
  @service site;
  @service router;
  @service appEvents;

  get currentUserInDnD() {
    return this.currentUser.isInDoNotDisturb();
  }

  get isActive() {
    return (
      this.chatStateManager.isFullPageActive ||
      this.chatStateManager.isDrawerActive
    );
  }

  @action
  toggleChatState() {
    if (this.chatStateManager.isFullPageActive) {
      // if we're in full page mode, switch to the last known forum URL
      this.router.transitionTo(this.chatStateManager.lastKnownAppURL);
    } else if (this.chatStateManager.isDrawerActive) {
      // if we're in the drawer, close the drawer
      this.chatStateManager.didToggleDrawer();
      this.appEvents.trigger(
        "chat:toggle-close",
        this.chatStateManager.isDrawerActive
      );
    } else {
      // if we're not in full page mode...
      if (this.chatStateManager.isDrawerPreferred) {
        // ...if we prefer the drawer, open the drawer
        this.appEvents.trigger(
          "chat:open-url",
          this.chatStateManager.lastKnownChatURL
        );
      } else {
        // ...if we don't prefer the drawer, switch to the last known forum URL
        this.router.transitionTo(this.chatStateManager.lastKnownChatURL);
      }
    }
  }
}
