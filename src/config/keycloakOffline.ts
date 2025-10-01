// ReactKeycloakProvider ile kullanılabilecek basit bir Keycloak mock'u
// init() hata fırlatmaz ve authenticated=false döner.

type KeycloakInitResult = { authenticated: boolean };

const keycloakOffline: any = {
  authenticated: false,
  token: null,
  tokenParsed: null,
  realm: 'offline',
  clientId: 'offline-client',
  authServerUrl: '',
  init: async (): Promise<KeycloakInitResult> => ({ authenticated: false }),
  login: () => {},
  logout: async () => {},
  updateToken: async (_minValidity?: number) => true,
  onTokenExpired: undefined,
};

export default keycloakOffline;


