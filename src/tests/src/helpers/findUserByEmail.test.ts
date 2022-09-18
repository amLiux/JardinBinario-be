import { UserModel } from '../../../models/User';
import { findUserByEmail } from '../../../helpers/findUserByEmail';

describe('findUserByEmail', () => {
	const testEmail = 'marceliux@tutamail.com';

	afterAll(() => {
		jest.clearAllMocks();
	});

	describe('happyPath', () => {
		const mockUser = {
			name: 't',
			lastName: 'e',
			id: 's',
			createdAt: 't',
			email: testEmail,
		};
	
		const findOneSpy = jest.spyOn(UserModel, 'findOne').mockReturnValueOnce(mockUser as any);

		it('should call findOne and return a user', () => {
			findUserByEmail(testEmail).then((User) => {
				expect(User?.email).toBe(testEmail);
				expect(findOneSpy).toHaveBeenCalled();
			});
		});
	});


	describe('sadPath', () => {
		const hipoteticErrorMsg = 'Failed search';
		const findOneSpy = jest.spyOn(UserModel, 'findOne').mockImplementation(() => {
			return Promise.reject(new Error(hipoteticErrorMsg)) as any;
		});
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => false);

		it('should call findOne but receive an error', async () => {
			findUserByEmail(testEmail).then((User) => {
				expect(User).toBe(undefined);
				expect(findOneSpy).toHaveBeenCalled();
				expect(consoleSpy).toHaveBeenCalled();
			});
		});
	});
});
