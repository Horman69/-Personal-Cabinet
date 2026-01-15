import { PrismaService } from '../../prisma/prisma.service';

export class UsernameGenerator {
    /**
     * Генерирует username из email
     * john.doe@example.com → johndoe
     */
    static fromEmail(email: string): string {
        const localPart = email.split('@')[0];
        // Удаляем точки, спецсимволы, оставляем только буквы и цифры
        let cleaned = localPart
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

        // Если пустой или начинается с цифры, добавляем префикс
        if (!cleaned || /^[0-9]/.test(cleaned)) {
            cleaned = `user${cleaned || Math.floor(Math.random() * 10000)}`;
        }

        // Обрезаем до 20 символов
        return cleaned.substring(0, 20);
    }

    /**
     * Генерирует уникальный username, проверяя базу данных
     */
    static async generateUnique(
        baseUsername: string,
        prisma: PrismaService,
    ): Promise<string> {
        // Если базовый username короче 4 символов, добавляем "user"
        if (baseUsername.length < 4) {
            baseUsername = `user${baseUsername}`;
        }

        let username = baseUsername;
        let counter = 1;
        const maxAttempts = 100;

        // Проверяем уникальность (максимум 100 попыток)
        while (counter <= maxAttempts && await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;

            // Если слишком длинный, обрезаем базовую часть
            if (username.length > 20) {
                const maxBaseLength = 20 - counter.toString().length;
                username = `${baseUsername.substring(0, maxBaseLength)}${counter}`;
            }
        }

        return username;
    }

    /**
     * Валидация формата username
     */
    static isValid(username: string): boolean {
        // 4-20 символов, только буквы, цифры, подчеркивание, дефис
        // Должен начинаться с буквы
        const regex = /^[a-z][a-z0-9_-]{3,19}$/;
        return regex.test(username);
    }

    /**
     * Генерирует альтернативные варианты username
     */
    static generateAlternatives(baseUsername: string): string[] {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000);

        return [
            `${baseUsername}_${year}`,
            `${baseUsername}_user`,
            `${baseUsername}${random}`,
        ].filter(u => u.length >= 4 && u.length <= 20);
    }
}
