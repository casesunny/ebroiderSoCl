import {Ctx} from 'blitz';
import db, {Prisma} from 'db';

type GetDesignsInput = Pick<
Prisma.FindManyDesignArgs,
'where' | 'orderBy' | 'skip' | 'take'
>;

export default async function getDesigns(
	{where, orderBy, skip = 0, take}: GetDesignsInput,
	ctx: Ctx
) {
	ctx.session.$authorize();

	const designs = await db.design.findMany({
		where: {
			...where,
			userId: ctx.session.userId
		},
		orderBy,
		take,
		skip
	});

	const count = await db.design.count();
	const hasMore = typeof take === 'number' ? skip + take < count : false;
	const nextPage = hasMore ? {take, skip: skip + take!} : null;

	return {
		designs,
		nextPage,
		hasMore,
		count
	};
}
