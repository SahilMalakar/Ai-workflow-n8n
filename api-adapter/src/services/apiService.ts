let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getTokenEndpoint(instanceUrl: string): Promise<string> {
  const openIdConfigUrl = `${instanceUrl}/.well-known/openid-configuration`;
  const config = await fetchData(openIdConfigUrl);
  if (!config.token_endpoint) {
    throw new Error("Token endpoint not found in OpenID configuration");
  }
  return config.token_endpoint;
}

export async function getAccessToken(
  instanceUrl: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken!;
  }

  const tokenEndpoint = await getTokenEndpoint(instanceUrl);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to obtain access token: ${response.status} ${response.statusText}`,
    );
  }

  const tokenData: any = await response.json();

  if (!tokenData.access_token) {
    throw new Error("Access token not found in response");
  }

  cachedToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in || 3600;
  tokenExpiry = Date.now() + expiresIn * 1000;

  return cachedToken!;
}

export async function apiRequest(
  instanceUrl: string,
  clientId: string,
  clientSecret: string,
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  type ApiRequestResult = { retry: true } | { data: any };

  const makeRequest = async (token: string): Promise<ApiRequestResult> => {
    const url = `${instanceUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      return { retry: true };
    }

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return { data: await response.json() };
  };

  let token = await getAccessToken(instanceUrl, clientId, clientSecret);
  let result = await makeRequest(token);

  if ("retry" in result) {
    cachedToken = null;
    tokenExpiry = null;

    token = await getAccessToken(instanceUrl, clientId, clientSecret);
    result = await makeRequest(token);

    if ("retry" in result) {
      throw new Error("Authentication failed after token refresh");
    }
  }

  return result.data;
}

export async function callAbacusAPI(
  method: string,
  url: string,
  token: string,
  data?: unknown,
  retries = 1,
): Promise<any> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const makeRequest = async (): Promise<any> => {
    const requestInit: RequestInit = {
      method,
      headers,
      body:
        data &&
        method.toUpperCase() !== "GET" &&
        method.toUpperCase() !== "HEAD"
          ? JSON.stringify(data)
          : undefined,
    };

    const response = await fetch(url, requestInit);

    if (response.status === 401) {
      throw new Error("Unauthorized: token invalid or expired");
    }

    if (response.status === 404) {
      throw new Error(`Not found: ${url}`);
    }

    if (response.status >= 500) {
      const errorText = await response.text();
      throw new Error(
        `Server error ${response.status}: ${errorText || response.statusText}`,
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed ${response.status}: ${errorText || response.statusText}`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return response.text();
  };

  try {
    return await makeRequest();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Unauthorized") && retries > 0) {
      return await callAbacusAPI(method, url, token, data, retries - 1);
    }
    throw new Error(`Abacus API request failed: ${errorMessage}`);
  }
}

