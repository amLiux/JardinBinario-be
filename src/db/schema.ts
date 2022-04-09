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

	type Query {
		getUserInfo(token:String!): User
	}

	type Token {
		token: String
	}

	type Mutation {
		newUser(userInput: UserInput): User
		authenticate(authInput: AuthInput): Token
	}
`;