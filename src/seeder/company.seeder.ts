import { database } from '../util/database';
import faker from 'faker';
import { randomInt } from 'crypto';
import Company from '../models/company.model';
import Profile from '../models/profile.model';
import User from '../models/user.model';
import { slugify } from '../functions/slugifyName';

database.sequelize.sync({ force: true }).then(async () => {
	for (let index = 0; index < 30; index++) {
		const company = await Company.create({
			name: faker.company.companyName(),
			logo: faker.image.imageUrl(200, 200, '', true),
			slug: slugify(faker.company.companyName()),
		});

		for (let j = 0; j < randomInt(1, 10); j++) {
			const user = await User.create({
				username: faker.name.firstName(),
				email: faker.internet.email(),
				role: 'company_user',
				password: faker.internet.password(),
			});

			company.addProfile(
				await user.createProfile({
					status: 'Pending',
					name: faker.name.firstName(),
					profilePhoto: faker.image.imageUrl(200, 200, '', true),
					userId: user.id,
				})
			);
		}
	}
});
