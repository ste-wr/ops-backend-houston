import { Request, Router, Response } from 'express'
import { REGIONS, getActiveTasks, getContainerUserIDs, container } from "../controller/aws/containers"
import { ListTasksCommandOutput } from '@aws-sdk/client-ecs'

const router: Router = Router()

router.get('/container/list', (_req: Request, res: Response) => {
    for(const [_key, value] of Object.entries(REGIONS)) {
        getActiveTasks(value)
        .then((data: ListTasksCommandOutput | null) => {
            if(data) {
                if (data.taskArns && data.taskArns?.length > 0) {
                    getContainerUserIDs(value, data.taskArns)
                    .then((containers: Array<container>) => {
                        let data = {
                            active_virtual_user_ids: containers
                        }
                        res.status(200).json(data)

                    })
                }
            }
        })
    }
})

export default router