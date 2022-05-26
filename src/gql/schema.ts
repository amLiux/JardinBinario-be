import { gql } from 'apollo-server';


export const typeDefs = gql` 
	type User {
		id: ID
		name: String
		email: String
		lastName: String
	}

	input UserInput {
		name: String!
		email: String!
		lastName: String!
		password: String!
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
	}

	type BlogEntry {
		id: ID
		author: Author
		tags: [String]
		createdAt: String
		title: String
		markdown: String
	}

	# TODO need to test performance, we are requiring everything for sharing schema between newBlog and updateBlog Mutations

	input BlogInput {
		title: String!
		markdown: String!
		tags: [String]
	}

	input ForgotPasswordInput {
		email: String!
		otp: String!
		time: String!
		newPassword: String!
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
		deleteBlogEntry(blogId: String): String
		recoverDeletedBlogEntry(blogId: String): BlogEntry
	}

	type Query {
		getUserInfo: User
		getSpecificBlogEntry(blogId:String!): BlogEntry
		getRecentEntries: [BlogEntry]
		getDeletedEntries: [BlogEntry]
		getEntriesByAuthor(authorId:String!): [BlogEntry]
	}
`;