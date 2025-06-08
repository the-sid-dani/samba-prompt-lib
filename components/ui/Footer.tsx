import Link from 'next/link';
import { ExternalLink, Clock, MessageSquare } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="w-full border-t border-border bg-background py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">ATF</span>
							</div>
							<h3 className="text-lg font-semibold text-foreground">AI Task Force</h3>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Empowering SambaTV with intelligent workflows.
						</p>
					</div>

					{/* Quick Actions */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
						<div className="flex flex-col space-y-3">
							<a
								href="https://forms.gle/claudeaccess"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								Request Claude Access
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
							<a
								href="https://airtable.com/appKK5oASrMHZix8k/pagzHZUCtEDVdfEBg/form"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								Submit AI Use Case
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
							<a
								href="mailto:sid.dani@samba.tv?subject=AI%20Issue%20Report"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								Report an Issue
							</a>
						</div>
					</div>

					{/* Resources */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Resources</h3>
						<div className="flex flex-col space-y-3">
							<a
								href="https://confluence.samba.tv/display/AI"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								Documentation Hub
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
							<a
								href="https://confluence.samba.tv/display/AI/Training"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								Training & Workshops
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
							<a
								href="https://airtable.com/appKK5oASrMHZix8k/shri8EZPsmHRdgWj9"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								Tool Directory
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
						</div>
					</div>

					{/* Connect */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground">Connect</h3>
						<div className="flex flex-col space-y-3">
							<a
								href="slack://channel?team=T025F3W2X&id=ai-enablement"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
							>
								<MessageSquare className="w-4 h-4" />
								#ai-enablement
							</a>
							<a
								href="slack://channel?team=T025F3W2X&id=ai-policy-qa"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
							>
								<MessageSquare className="w-4 h-4" />
								#ai-policy-qa
							</a>
							<a
								href="https://calendar.google.com/calendar/appointments/AcZssZ2H5oU_aBK9gF9VZlI4QHV2FCT8Vs4kxG8dNP4="
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
							>
								<Clock className="w-4 h-4" />
								Office Hours: Thu 3PM
								<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
							</a>
						</div>
					</div>
				</div>

				{/* Mobile Quick Actions */}
				<div className="mt-8 lg:hidden">
					<div className="flex flex-wrap gap-2 justify-center">
						<a
							href="https://forms.gle/claudeaccess"
							target="_blank"
							rel="noopener noreferrer"
							className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
						>
							Request Access
						</a>
						<a
							href="https://airtable.com/appKK5oASrMHZix8k/pagzHZUCtEDVdfEBg/form"
							target="_blank"
							rel="noopener noreferrer"
							className="px-3 py-2 bg-muted text-foreground text-sm rounded-md hover:bg-muted/80 transition-colors"
						>
							Submit Use Case
						</a>
						<a
							href="mailto:sid.dani@samba.tv?subject=AI%20Issue%20Report"
							className="px-3 py-2 bg-muted text-foreground text-sm rounded-md hover:bg-muted/80 transition-colors"
						>
							Get Help
						</a>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t border-border">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-sm text-muted-foreground text-center md:text-left">
							© {new Date().getFullYear()} SambaTV AI Task Force | Internal Use Only
						</p>
						<p className="text-sm text-muted-foreground text-center md:text-right">
							Questions?{' '}
							<a
								href="mailto:sid.dani@samba.tv"
								className="text-red-600 hover:text-red-700 transition-colors"
							>
								sid.dani@samba.tv
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer; 