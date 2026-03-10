import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router() as Router;

interface CreateUserBody {
  name: string;
  email: string;
}

interface CreateUserResponse {
  message: string;
}

interface FetchUserResponse {
  id: number;
  name: string;
  email: string;
}

interface ErrorResponse {
  error: string;
}



router.post(
  "/users",
  async (
    req: Request<{}, {}, CreateUserBody>, // Params={}, ResBody=any, ReqBody=CreateUserBody
    res: Response<CreateUserResponse | ErrorResponse>
  ) => {
    const { name, email } = req.body;

    try {
      const user = await prisma.user.create({
        data: { name, email },
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while creating the user" });
    }
  }
);

router.get(
    "/users",
    async (req: Request, res: Response<FetchUserResponse[]|ErrorResponse>) => {
      try {
        const users = await prisma.user.findMany();
        const formattedUsers : FetchUserResponse[] = users.map(user => ({
          id: user.id,
          name: user.name ?? "Unnamed User",
          email: user.email,
        }));
        res.json(formattedUsers);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching users" });
      }
    }
);

export default router;