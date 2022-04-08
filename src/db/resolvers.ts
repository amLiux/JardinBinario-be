interface Message {
	message: string,
}

export const resolvers = {
	Query: {
		sayHello: ():Message => {
			return {
				message: 'Hello World',
			};
		},
	},
};