const JB_DOMAIN_RE = /@jardinbinario.com\s*$/

export const isNotJBDomain = (email: string): boolean => {
	return !JB_DOMAIN_RE.test(email)
}
