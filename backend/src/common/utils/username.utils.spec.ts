import { UsernameGenerator } from './username.utils';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsernameGenerator', () => {
    describe('fromEmail', () => {
        it('should extract username from simple email', () => {
            expect(UsernameGenerator.fromEmail('john@example.com')).toBe('john');
            expect(UsernameGenerator.fromEmail('alice@gmail.com')).toBe('alice');
        });

        it('should handle dots and underscores', () => {
            expect(UsernameGenerator.fromEmail('john.doe@example.com')).toBe('johndoe');
            expect(UsernameGenerator.fromEmail('test_user@gmail.com')).toBe('testuser');
        });

        it('should handle special characters', () => {
            expect(UsernameGenerator.fromEmail('user+tag@example.com')).toBe('usertag');
            expect(UsernameGenerator.fromEmail('test-user@example.com')).toBe('testuser');
        });

        it('should truncate to 20 characters', () => {
            const longEmail = 'verylongemailaddress1234567890@example.com';
            const result = UsernameGenerator.fromEmail(longEmail);
            expect(result.length).toBeLessThanOrEqual(20);
        });

        it('should ensure username starts with letter', () => {
            const result = UsernameGenerator.fromEmail('123user@example.com');
            expect(result).toMatch(/^[a-z]/);
        });

        it('should handle empty local part', () => {
            const result = UsernameGenerator.fromEmail('@example.com');
            expect(result).toMatch(/^user[0-9]+$/);
        });
    });

    describe('isValid', () => {
        it('should validate correct usernames', () => {
            expect(UsernameGenerator.isValid('john')).toBe(true);
            expect(UsernameGenerator.isValid('user123')).toBe(true);
            expect(UsernameGenerator.isValid('test_user')).toBe(true);
            expect(UsernameGenerator.isValid('my-username')).toBe(true);
        });

        it('should reject too short usernames', () => {
            expect(UsernameGenerator.isValid('ab')).toBe(false);
            expect(UsernameGenerator.isValid('a')).toBe(false);
            expect(UsernameGenerator.isValid('')).toBe(false);
        });

        it('should reject too long usernames', () => {
            expect(UsernameGenerator.isValid('a'.repeat(21))).toBe(false);
            expect(UsernameGenerator.isValid('verylongusernamethatexceedslimit')).toBe(false);
        });

        it('should reject usernames starting with number', () => {
            expect(UsernameGenerator.isValid('123user')).toBe(false);
            expect(UsernameGenerator.isValid('9test')).toBe(false);
        });

        it('should reject usernames with invalid characters', () => {
            expect(UsernameGenerator.isValid('user@name')).toBe(false);
            expect(UsernameGenerator.isValid('user name')).toBe(false);
            expect(UsernameGenerator.isValid('user.name')).toBe(false);
            expect(UsernameGenerator.isValid('user!name')).toBe(false);
        });
    });

    describe('generateUnique', () => {
        let prismaService: PrismaService;

        beforeEach(() => {
            prismaService = {
                user: {
                    findUnique: jest.fn(),
                },
            } as any;
        });

        it('should return base username if available', async () => {
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await UsernameGenerator.generateUnique('testuser', prismaService);
            expect(result).toBe('testuser');
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { username: 'testuser' },
            });
        });

        it('should append number if username is taken', async () => {
            (prismaService.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce(null);

            const result = await UsernameGenerator.generateUnique('testuser', prismaService);
            expect(result).toBe('testuser1');
        });

        it('should increment number until unique username found', async () => {
            (prismaService.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({ username: 'testuser' })
                .mockResolvedValueOnce({ username: 'testuser1' })
                .mockResolvedValueOnce({ username: 'testuser2' })
                .mockResolvedValueOnce(null);

            const result = await UsernameGenerator.generateUnique('testuser', prismaService);
            expect(result).toBe('testuser3');
        });

        it('should stop after 100 attempts', async () => {
            (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ username: 'testuser' });

            const result = await UsernameGenerator.generateUnique('testuser', prismaService);
            expect(result).toMatch(/^testuser[0-9]+$/);
            // Должно быть не больше 100 вызовов (базовый + 99 попыток)
            expect(prismaService.user.findUnique).toHaveBeenCalledTimes(100);
        });
    });

    describe('generateAlternatives', () => {
        it('should generate alternative usernames', () => {
            const result = UsernameGenerator.generateAlternatives('test');
            expect(result.length).toBeGreaterThan(0);
            expect(result.length).toBeLessThanOrEqual(3);
            expect(result.every(u => u.startsWith('test'))).toBe(true);
        });

        it('should ensure all alternatives are unique', () => {
            const result = UsernameGenerator.generateAlternatives('test');
            const uniqueSet = new Set(result);
            expect(uniqueSet.size).toBe(result.length);
        });

        it('should generate different alternatives each time', () => {
            const result1 = UsernameGenerator.generateAlternatives('test');
            const result2 = UsernameGenerator.generateAlternatives('test');

            // Хотя бы один должен отличаться (из-за random)
            const allSame = result1.every((val, idx) => val === result2[idx]);
            expect(allSame).toBe(false);
        });
    });
});
