"use strict";
exports.__esModule = true;
function getLoginLink(redirect) {
    var loginLink = new URL("".concat(process.env.DASHBOARD_BASE_URL, "/auth/login"));
    loginLink.searchParams.append('token', this.id);
    loginLink.searchParams.append('redirect', encodeURIComponent(redirect || '/query'));
    return loginLink;
}
exports["default"] = getLoginLink;
