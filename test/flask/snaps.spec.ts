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
    await metamask.snaps.installSnap(this.snapServers[Snaps.BASE_SNAP], {
      hasPermissions: false,
      hasKeyPermissions: false,
    });
  });

  it("should install permissions snap local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.PERMISSIONS_SNAP], {
      hasPermissions: true,
      hasKeyPermissions: false,
    });
  });

  it("should install keys snap from local server", async function (this: TestContext) {
    await metamask.snaps.installSnap(this.snapServers[Snaps.KEYS_SNAP], {
      hasPermissions: true,
      hasKeyPermissions: true,
    });
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
        return;
      }
      snapId = await metamask.snaps.installSnap(
        this.snapServers[Snaps.METHODS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
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

    it("should invoke IN APP NOTIFICATIONS", async function (this: TestContext) {
      const permissionSnapId = await metamask.snaps.installSnap(
        metamask.page,
        this.snapServers[Snaps.PERMISSIONS_SNAP],
        {
          hasPermissions: true,
          hasKeyPermissions: false,
        }
      );

      await metamask.snaps.invokeNotification(testPage, snapId, "notify_inApp");
      await metamask.snaps.invokeNotification(
        testPage,
        permissionSnapId,
        "notify_inApp"
      );

      const notifications = await metamask.snaps.getAllNotifications();

      expect(notifications[0].message).to.have.equal(
        "Hello from permissions snap in App notification"
      );
      expect(notifications[1].message).to.have.equal(
        "Hello from methods snap in App notification"
      );
    });
  });
});
