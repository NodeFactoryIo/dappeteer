import { DappeteerPage, Serializable } from "../page";
import { flaskOnly } from "./utils";

export async function invokeSnap<
  R = unknown,
  P extends Serializable = Serializable
>(
  page: DappeteerPage,
  snapId: string,
  method: string,
  params?: P
): ReturnType<typeof window.ethereum.request<R>> {
  flaskOnly(page);
  return page.evaluate(
    //@ts-expect-error
    async (opts: { snapId: string; method: string; params: P }) => {
      return window.ethereum.request<R>({
        method: "wallet_invokeSnap",
        params: [
          `${opts.snapId}`,
          {
            method: opts.method,
            params: opts.params,
          },
        ],
      });
    },
    { snapId, method, params }
  );
}
