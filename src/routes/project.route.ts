import {Request,Response,Router} from 'express';
import prisma from '../prisma.js';
const router = Router() as Router;

interface CreateProjectBody {
    name: string;
    ownerId: number;
}

router.post('/projects',async (req:Request,res:Response<{message: string}|{error: string}>)=>{
    const {name,ownerId} = req.body as CreateProjectBody;

    try{
        await prisma.project.create({
            data:{name,ownerId}
        })
        res.status(201).json({message:"Project created successfully"});
    } catch(error){
        console.error(error);
        res.status(500).json({error:"An error occurred while creating the project"});
    }
});

router.get('/projects',async (req:Request,res:Response<{id: number; name: string; ownerId: number; owner: {id: number; name: string}}[]|{error: string}>)=>{
    try{
        const projects = await prisma.project.findMany({include:{owner:true}});
        const formattedProjects = projects.map(project=>({
            id: project.id,
            name: project.name,
            ownerId: project.ownerId,
            owner: {
                id: project.owner.id,
                name: project.owner.name ?? "Unnamed User"
            }
        }));
        res.json(formattedProjects);
    } catch(error){
        console.error(error);
        res.status(500).json({error:"An error occurred while fetching the projects"});
    }
});

router.get('/projects/:projectId',async (req:Request,res:Response<{id: number; name: string; ownerId: number; tasks: {id: number; title: string}[]}|{error: string}>)=>{
    const {projectId} = req.params;
    try{
        const fetchedProject=await prisma.project.findUnique({
            where:{id: Number(projectId)},
            include:{tasks:true}
        });
        if(!fetchedProject){
            return res.status(404).json({error:"Project not found"});
        }
        const formattedProject = {
            id: fetchedProject.id,
            name: fetchedProject.name,
            ownerId: fetchedProject.ownerId,
            tasks: fetchedProject.tasks.map(task=>({
                id: task.id,
                title: task.title
            }))
        };
        res.json(formattedProject); 
} catch(error){
        console.error(error);
        res.status(500).json({error:"An error occurred while fetching the project"});
    }}

);

export default router;