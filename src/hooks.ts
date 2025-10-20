import type { Reroute } from '@sveltejs/kit'

export const reroute: Reroute = ({ url }) => {
	const hostname = url.hostname

	// Development: project1.localhost:5173 → /project/project1
	if (hostname.includes('localhost')) {
		const parts = hostname.split('.')
		if (parts.length > 1 && parts[0] !== 'localhost') {
			const subdomain = parts[0]
			return `/project/${subdomain}${url.pathname}`
		}
		return
	}

	// Production - main domain (admin/CMS)
	if (hostname === 'rowera.com' || hostname === 'www.rowera.com') {
		return
	}

	// Production - subdomains: project-slug.rowera.com → /project/project-slug
	if (hostname.endsWith('.rowera.com')) {
		const slug = hostname.replace('.rowera.com', '')
		// Exclude admin/api subdomains
		if (!['www', 'api', 'app', 'admin'].includes(slug)) {
			return `/project/${slug}${url.pathname}`
		}
	}

	// Custom domains: customdomain.com → /custom-domain
	// This will look up the project by custom domain in the database
	return `/custom-domain${url.pathname}`
}
