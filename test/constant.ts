import http from "http";

import { Provider, Server } from "ganache";

import web3 from "web3";
import { Dappeteer } from "../src";

import { DappeteerBrowser } from "../src/browser";
import { Contract, Snaps } from "./deploy";

export type InjectableContext = Readonly<{
  provider: Provider;
  ethereum: Server<"ethereum">;
  testPageServer: http.Server;
  snapServers?: Record<Snaps, string>;
  browser: DappeteerBrowser;
  metamask: Dappeteer;
  contract: Contract;
  flask: boolean;
}>;

// TestContext will be used by all the test
export type TestContext = Mocha.Context & InjectableContext;

export const LOCAL_PREFUNDED_MNEMONIC =
  "pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog";
export const PASSWORD = "password1234";

export const MESSAGE_TO_SIGN = web3.utils.sha3("TEST"); // "0x852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46";
export const EXPECTED_MESSAGE_SIGNATURE =
  "0x727c2e31ae342588b680dfc502f0d6a7b8d0f8b9afc4ca313bdad9dca80429741f50b78c2c98ac2f18c4ec1e8fade88c8d7477766d6ceeb1f3a3ddbe7d80e90f1c";
export const ACCOUNT_ADDRESS = "0x50707153077cFf1A48192311A12a5f905976AF14";
