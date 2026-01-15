import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Create SUPER_ADMIN user
    const adminEmail = 'admin@example.com'
    const adminPassword = 'Admin123!'

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    })

    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(adminPassword, 10)

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                username: 'admin',
                displayName: 'Super Admin',
                passwordHash,
                role: 'SUPER_ADMIN',
                emailVerified: true,
            },
        })

        console.log('✅ Super Admin created:')
        console.log(`   Email: ${adminEmail}`)
        console.log(`   Password: ${adminPassword}`)
        console.log(`   ID: ${admin.id}`)
    } else {
        // Update existing user to SUPER_ADMIN
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'SUPER_ADMIN' },
        })
        console.log('✅ Updated existing user to SUPER_ADMIN')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
