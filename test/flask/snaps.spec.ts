import { expect } from "chai";
import * as dappeteer from "../../src";
import { DappeteerPage } from "../../src";
import { TestContext } from "../constant";
import { Snaps } from "../deploy";

describe("snaps", function () {
  let metamask: dappeteer.Dappeteer;

  before(function (this: TestContext) {
    metamask = this.metamask;
  });

  beforeEach(function (this: TestContext) {
    //skip those tests for non flask metamask
    if (!this.browser.isMetaMaskFlask()) {
      this.skip();
    }
  });

  it("should install base snap from local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.BASE_SNAP]);
  });

  it("should install permissions snap local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.PERMISSIONS_SNAP]);
  });

  it("should install keys snap from local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.KEYS_SNAP]);
  });

  describe("should test snap methods", function () {
    let testPage: DappeteerPage;
    let snapId: string;

    beforeEach(function (this: TestContext) {
      //skip those tests for non flask metamask
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
      }
    });

    before(async function (this: TestContext) {
      if (!this.browser.isMetaMaskFlask()) {
        this.skip();
      }
      snapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.METHODS_SNAP]
      );
      testPage = await metamask.page.browser().newPage();
      await testPage.goto("https://google.com");
      return testPage;
    });

    it("should invoke provided snap method and ACCEPT the dialog", async function (this: TestContext) {
      const invokeAction = metamask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );

      await metamask.snaps.acceptDialog();

      expect(await invokeAction).to.equal(true);
    });

    it("should invoke provided snap method and REJECT the dialog", async function (this: TestContext) {
      const invokeAction = metamask.snaps.invokeSnap(
        testPage,
        snapId,
        "confirm"
      );
      await metamask.snaps.rejectDialog();

      expect(await invokeAction).to.equal(false);
    });

    it("should return all notifications", async function (this: TestContext) {
      const permissionSnapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.PERMISSIONS_SNAP]
      );

      const emitter = await metamask.snaps.getNotificationEmitter();
      const notificationPromise = emitter.waitForNotification();

      await metamask.snaps.invokeSnap(testPage, snapId, "notify_inApp");
      await metamask.snaps.invokeSnap(
        testPage,
        permissionSnapId,
        "notify_inApp"
      );
      await notificationPromise;

      const notifications = await metamask.snaps.getAllNotifications();

      expect(notifications[0].message).to.contain(
        "Hello from permissions snap in App notification"
      );
      expect(notifications[1].message).to.contain(
        "Hello from methods snap in App notification"
      );
      await emitter.cleanup();
    });
  });
});
