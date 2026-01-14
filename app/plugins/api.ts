import { getCookie, getResponseHeader } from "h3";
import type { FetchContext } from "ofetch";
import qs from "qs";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const event = useRequestEvent();

  const addTokenHeader = (ctx: FetchContext) => {
    let accessToken: string | null | undefined;

    if (import.meta.server) {
      accessToken = getCookie(event!, "accessToken");
      const responseCookies = getResponseHeader(event!, "set-cookie");
      if (Array.isArray(responseCookies)) {
        const responseCookiesByName = responseCookies.reduce<
          Record<string, string>
        >((acc, cookieStr) => {
          const [cookieName, cookieValue] = cookieStr.split(";")[0].split("=");
          acc[cookieName] = cookieValue;
          return acc;
        }, {});
        if (responseCookiesByName.accessToken) {
          accessToken = responseCookiesByName.accessToken;
        }
      }
    } else {
      accessToken = useCookie("accessToken").value;
    }
    if (accessToken) {
      ctx.options.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  };

  const serializeQueryParams = (ctx: FetchContext) => {
    if (ctx.options.params) {
      const stringifiedParams = qs.stringify(ctx.options.params, {
        arrayFormat: "brackets",
      });
      delete ctx.options.params;
      delete ctx.options.query;
      ctx.request = `${ctx.request}?${stringifiedParams}`;
    }
  };

  const api = $fetch.create({
    baseURL: `${runtimeConfig.public.apiBaseUrl}`,
    onRequest: (ctx) => {
      addTokenHeader(ctx);
      serializeQueryParams(ctx);
    },
  });

  return {
    provide: {
      api,
    },
  };
});
