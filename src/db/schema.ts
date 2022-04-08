import { gql } from 'apollo-server';


export const typeDefs = gql` 
	type BlogEntry {
		clientId: String
	}
	type Message {
		message: String
	}
	type Query {
		clientSecret: Message
		sayHello: Message
	}
`;