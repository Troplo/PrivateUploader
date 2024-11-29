function getWellKnownOidc() {
  const apiPrefix =
    config.hostnameWithProtocol === "https://flowinity.com"
      ? "https://api.flowinity.com/v3/"
      : `${config.hostnameWithProtocol}/api/v3/`
  return {
    issuer: `${config.hostnameWithProtocol}`,
    authorization_endpoint: `${config.hostnameWithProtocol}/oauth`,
    token_endpoint: `${apiPrefix}/v3/oidc/token`,
    userinfo_endpoint: `${apiPrefix}/v3/oidc/userinfo`,
    jwks_uri: `${apiPrefix}/v3/oidc/jwks.json`,
    scopes_supported: ["openid", "profile", "email", "offline_access"],
    response_types_supported: ["code", "id_token", "token id_token"],
    token_endpoint_auth_methods_supported: ["client_secret_basic"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["HS256"]
  }
}

export default getWellKnownOidc
