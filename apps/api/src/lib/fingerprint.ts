import Fingerprint, { useragent } from "express-fingerprint"

export default Fingerprint({
  parameters: [
    // Defaults
    Fingerprint.useragent,
    Fingerprint.acceptHeaders,
    Fingerprint.geoip,
  ],
})

