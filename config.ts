const config = {
	metadata: {
		title: "SambaTV Prompt Library",
		description: "Internal AI Prompt Library for SambaTV Employees",
		keywords: ["SambaTV", "AI", "Prompts", "Internal Tool", "Prompt Library"],
		icons: {
			// Standard favicon formats - works across all domains
			icon: [
				{ url: '/favicon.ico', sizes: 'any' },
				{ url: '/favicon.png', sizes: '32x32', type: 'image/png' },
				{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
				{ url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
			],
			// Apple devices
			apple: [
				{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
				{ url: '/favicon.png', sizes: '152x152', type: 'image/png' },
				{ url: '/favicon.png', sizes: '120x120', type: 'image/png' }
			],
			// Shortcut icon (fallback)
			shortcut: '/favicon.ico',
			// Other platforms
			other: [
				{ rel: 'mask-icon', url: '/favicon.png', color: '#E60000' }
			]
		},
		// Additional metadata for better cross-domain support
		manifest: '/site.webmanifest',
		themeColor: '#E60000'
	},
	theme: {
		colors: {
			primary: '#E60000',  // SambaTV Red
			primaryHover: '#CC0000',
			border: '#E5E7EB',  // Standard border color
			borderHover: '#D1D5DB'  // Border hover color
		}
	},
	appName: "SambaTV Prompt Library",
	socialLinks: {
		github: "https://github.com",
		twitter: "https://twitter.com",
		linkedin: "https://linkedin.com"
	},
	emailProvider: "nodemailer",
};


export default config;