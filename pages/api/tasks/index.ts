import dbConnect from "../../../server/db/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import Task from "../../../server/model/Task";
import ProjectCard from "../../../server/model/ProjectCard";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query } = req;
	const session = await getSession({ req });

	// console.log(session);

	// if (!session) {
	// 	return res
	// 		.status(401)
	// 		.send({ message: "Invalid credentials for user" });
	// }
	// const { id: userID } = session;
	await dbConnect();

	switch (method) {
		case "POST":
			try {
				const { title, projectCardID } = req.body;
				const task = { title, projectCardID };
				const newTask = new Task(task);
				await newTask.save();

				const projectCard = await ProjectCard.findOne({
					_id: projectCardID,
				});

				const { _id } = newTask;
				projectCard.tasks.push(_id);

				await projectCard.save();

				res.json({ newTask });
			} catch (err) {
				res.status(404).send({
					message: err.message,
				});
			}
			break;

		default:
			res.status(404).send({ message: "page not found!" });
			break;
	}
};