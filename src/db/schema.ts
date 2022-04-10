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

	type BlogEntry {
		id: ID
		author: ID
		theme: String
		createdAt: String
		title: String
		paragraphs: [Paragraph!]!
	}

	input BlogInput {
		author: String!
		theme: String!
		title: String!
		paragraphs: [ParagraphInput!]!
	}

	type Mutation {
		# Authentication
		newUser(userInput: UserInput): User
		authenticate(authInput: AuthInput): Token

		# Blog
		newBlogEntry(blogInput: BlogInput): BlogEntry
	}

	type Query {
		getUserInfo(token:String!): User
		getSpecificBlogEntry(blogId:String!): BlogEntry
		getRecentEntries: [BlogEntry]
	}
`;