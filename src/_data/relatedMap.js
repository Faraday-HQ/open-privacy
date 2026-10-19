// Hand-picked internal links between guides (pillars) and answers (spokes).
// Keys and values are page URLs. Titles are looked up at build time, so a
// renamed page updates everywhere, and a missing page fails the link check.
const a = (slug) => `/answers/${slug}/`;
const s = (slug) => `/scams/${slug}/`;
export default {
  "/guides/people/your-rights/": [a("find-out-what-a-company-knows-about-me-nz"), a("how-long-to-respond-privacy-request-nz"), a("company-has-wrong-information-nz"), a("right-to-be-forgotten-nz"), a("get-my-medical-records-nz")],
  "/guides/people/tech-abuse/": [a("is-my-phone-being-tracked"), a("neighbour-cctv-nz"), a("drones-over-property-nz")],
  "/guides/people/online-harassment/": [a("photos-posted-without-consent-nz"), a("deepfakes-law-nz"), a("recording-conversations-nz")],
  "/guides/people/image-abuse/": [a("deepfakes-law-nz"), a("photos-posted-without-consent-nz")],
  "/guides/people/scams/": [s("ird-tax-refund-scam"), s("toll-parking-qr-code-scams"), s("bank-impersonation-safe-account-scam"), s("parcel-delivery-text-scams"), s("investment-and-romance-scams")],
  "/guides/people/identity-theft/": [a("business-copy-drivers-licence-nz"), a("remove-personal-information-from-google-nz")],
  "/guides/people/public-records/": [a("remove-personal-information-from-google-nz"), a("right-to-be-forgotten-nz")],
  "/guides/people/higher-risk-roles/": [a("remove-personal-information-from-google-nz"), a("photos-posted-without-consent-nz")],
  "/guides/people/account-security/": [a("is-my-phone-being-tracked"), s("bank-impersonation-safe-account-scam")],
  "/guides/organisations/privacy-act-plain-language/": [a("do-i-need-a-privacy-policy-nz"), a("what-is-a-notifiable-privacy-breach"), a("gdpr-and-nz-businesses"), a("overseas-cloud-services-privacy-act")],
  "/guides/organisations/breach-response/": [a("what-is-a-notifiable-privacy-breach")],
  "/guides/organisations/cctv-and-monitoring/": [a("employer-monitoring-nz"), a("neighbour-cctv-nz"), a("recording-conversations-nz")],
  "/guides/organisations/access-requests/": [a("how-long-to-respond-privacy-request-nz"), a("businesses-sharing-with-police-nz"), a("company-has-wrong-information-nz")],
  "/guides/organisations/suppliers-and-overseas/": [a("overseas-cloud-services-privacy-act"), a("gdpr-and-nz-businesses")],
  "/guides/organisations/community-groups/": [a("email-marketing-rules-nz"), a("photos-posted-without-consent-nz")],
  "/guides/organisations/ai-at-work/": [a("overseas-cloud-services-privacy-act")],
  "/guides/organisations/first-90-days/": [a("do-i-need-a-privacy-policy-nz"), a("email-marketing-rules-nz")],
};
