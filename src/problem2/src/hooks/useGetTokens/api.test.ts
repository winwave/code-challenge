import { vi, describe, expect, it } from "vitest";
import {fetchTokenPrices, ICON_BASE_URL} from "./api";

const tokensMock = [
  {"currency":"BLUR","date":"2023-08-29T07:10:40.000Z","price":0.20811525423728813},
  {"currency":"bNEO","date":"2023-08-29T07:10:50.000Z","price":7.1282679},
  {"currency":"USD","date":"2023-08-29T07:10:30.000Z","price":1}
];

function mockResponseWith(status: number, json: object) {
  const mockFetch = vi.spyOn(globalThis, "fetch");
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  } as never);
}

describe("fetchTokenPrices API", () => {
  it("should fetch data successfully", async () => {
    mockResponseWith(200, tokensMock);

    const response = await fetchTokenPrices();

    expect(response).toEqual([
      {
        "currency":"BLUR",
        "date": new Date("2023-08-29T07:10:40.000Z"),
        "price":0.20811525423728813,
        "iconUrl": `${ICON_BASE_URL}BLUR.svg`
      },
      {
        "currency":"bNEO",
        "date": new Date("2023-08-29T07:10:50.000Z"),
        "price":7.1282679,
        "iconUrl": `${ICON_BASE_URL}bNEO.svg`,
      },
      {
        "currency":"USD",
        "date": new Date("2023-08-29T07:10:30.000Z"),
        "price":1,
        "iconUrl": `${ICON_BASE_URL}USD.svg`,
      }
    ]);
  });

  describe("response parsing", () => {
    it("should raise on invalid response schema", async () => {
      mockResponseWith(200, [
        {"invalid_currency":"invalid","date":"2023-08-29T07:10:40.000Z","price":0.20811525423728813},
        ...tokensMock,
      ]);

      await expect(() => fetchTokenPrices()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining("currency"),
        }),
      );
    });
  });
});
