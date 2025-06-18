const config = {
	metadata: {
		title: "SambaTV Prompt Library",
		description: "Internal AI Prompt Library for SambaTV Employees",
		keywords: ["SambaTV", "AI", "Prompts", "Internal Tool", "Prompt Library"],
		icons: {
			icon: [
				{ url: '/favicon.png', sizes: '32x32', type: 'image/png' },
				{ url: '/favicon.ico', sizes: 'any' }
			],
			apple: { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
			shortcut: '/favicon.ico'
		}
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