import { gql } from 'apollo-server';

export const typeDefs = gql`
	scalar JSON
	scalar JSONObject

	type User {
		id: ID
		name: String
		email: String
		lastName: String
		avatar: String
	}

	input UserInput {
		name: String!
		email: String!
		lastName: String!
		password: String!
		avatar: String!
	}

	input AuthInput {
		email: String!
		password: String!
	}

	type Token {
		token: String
	}

	input ImageInput {
		url: String!
		position: String!
	}

	type Image {
		url: String!
		position: String!
	}

	input ParagraphInput {
		subtitle: String
		image: ImageInput
		text: String!
	}
	
	type Paragraph {
		subtitle: String
		image: Image
		text: String!
	}

	type Author {
		_id: ID
		name: String
		lastName: String
		email: String
		avatar: String
	}

	type BlogEntry {
		_id: ID
		author: Author
		tags: [String]
		createdAt: String
		title: String
		markdown: String
		views: Int
		shares: Int
		sneakpeak: String
		deleted: Boolean
	}

	type Ticket {
		id: ID
		companyName: String
		email: String
		description: String
		service: [String]
		phoneNumber: String
	}

	type NewsletterEntry {
		id: ID
		email: String
		status: String
	}

	type Metrics {
		metricName: String!
		count: JSON
		dueDate: String!
	}


	# TODO need to test performance, we are requiring everything for sharing schema between newBlog and updateBlog Mutations

	input BlogInput {
		title: String!
		markdown: String!
		tags: [String]
		sneakpeak: String!
		# TODO do we need this here?
		shares: Int
		_id: String
	}

	input BlogMetricsInput {
		id: String!
		shares: Boolean
		views: Boolean
	}

	input TicketInput {
		companyName: String!
		email: String!
		description: String!
		service: [String]
		phoneNumber: String
	}

	input NewsletterInput {
		email: String!
	}

	input ForgotPasswordInput {
		email: String!
		otp: String!
		time: String!
		newPassword: String!
	}

	input MetricsInput {
		timezone: String!
		language: String!
		country: String!
		userAgent: String!
	}

	type ImageData {
		prompt: String!
		img: Image!
		date: String!
	}

	type Image {
		buffer: String!
		contentType: String!
	}

	type Mutation {
		# Authentication
		newUser(userInput: UserInput): User
		authenticate(authInput: AuthInput): Token
		initForgotPassword(email: String): String
		finishForgotPassword(forgotPasswordInput: ForgotPasswordInput): User

		# Blog
		newBlogEntry(blogInput: BlogInput): BlogEntry
		updateBlogEntry(blogInput: BlogInput): BlogEntry
		updateBlogMetrics(blogMetricsInput: BlogMetricsInput): Boolean
		deleteBlogEntry(blogId: String): String
		recoverDeletedBlogEntry(blogId: String): String
		# Ticket
		newTicket(ticketInput: TicketInput): Ticket
		updateTicket(ticketInput: TicketInput): Ticket
		
		# Newsletter
		newNewsletterEntry(newsletterInput: NewsletterInput): NewsletterEntry
		updateNewsletterEntry(newsletterInput: NewsletterInput): NewsletterEntry

		# Metrics
		newUserDetailsEntry(metricsInput: MetricsInput): Boolean
	}

	type Query {
		getUserInfo: User
		getSpecificBlogEntry(blogId:String!): BlogEntry
		getRecentEntries: [BlogEntry]
		getDeletedEntries: [BlogEntry]
		getAllEntriesIds: [BlogEntry]
		getAllEntries: [BlogEntry]
		getEntriesByAuthor(authorId:String!): [BlogEntry]
		getMostViewedEntries:[BlogEntry]
		getOpenTickets: [Ticket]
		getSubscribedEmails: [NewsletterEntry]
		getMetric(metricName:String!):Metrics
		getImageByPrompt(prompt:String!):ImageData!
		getImageById(imageId:String!):ImageData!
		getAllImagesOfDay:[ImageData]!
	}
`;