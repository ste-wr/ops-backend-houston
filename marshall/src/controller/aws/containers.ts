import { DescribeTasksCommand, DescribeTasksCommandInput, DescribeTasksCommandOutput, ECSClient, ListTasksCommand, ListTasksCommandInput, ListTasksCommandOutput, Tag, Task } from "@aws-sdk/client-ecs"

export const REGIONS: {[name: string]: string } = {
    'ohio': 'us-east-2',
    'sydney': 'ap-southeast-2'
}

export type container = {
    arn: string
    user_id: number
}

export const getActiveTasks = async (region: string) => {
    const client = new ECSClient({
        region: region
    })

    const listParameters: ListTasksCommandInput = {
        cluster: 'virtual-user-framework-cls',
        launchType: 'FARGATE'
    }

    try {
        const tasks: ListTasksCommandOutput = await client.send(
            new ListTasksCommand(listParameters)
        )
        client.destroy()
        return tasks
    } catch (err) {
        console.error("Error:", err)
        client.destroy()
        return null
    }
}

export const getContainerDetails = async (region: string, taskList: Array<string>) => {
    const client = new ECSClient({
        region: region
    })

    const detailsParameters: DescribeTasksCommandInput = {
        cluster: 'virtual-user-framework-cls',
        tasks: taskList,
        include: [
            'TAGS'
        ]
    }

    try {
        const details: DescribeTasksCommandOutput = await client.send(
            new DescribeTasksCommand(detailsParameters)
        )
        client.destroy()
        return details
    } catch (err) {
        console.error("Error:", err)
        client.destroy()
        return null
    }
}

export const getContainerUserIDs = async (region: string, taskList: Array<string>) => {
    const containers: Array<container> = []
    return new Promise<Array<container>>((resolve, reject) => {
        getContainerDetails(region, taskList)
        .then((details: DescribeTasksCommandOutput | null) => {
            if(details && details.tasks && details.tasks?.length > 0) {
                details.tasks.forEach((task: Task) => {
                    if(task.tags)
                    {
                        if(task.tags.length == 0) {
                            // we should raise an alert here because a running task in the virtual user cluster should have tags
                            console.error('This task should have tags!  Investigation required')
                            console.error(task)
                        }
                        task.tags.forEach((value: Tag) => {
                            if(value.key == "TEOOH_VIRTUAL_USER_ID") {
                                if (value.value) {
                                    containers.push({
                                        arn: task.taskArn || '',
                                        user_id: parseInt(value.value)
                                    })
                                }
                            }
                        })
                    }
                })
            }
            resolve(containers)
        })
        .catch(err => {
            console.error(err)
            reject(err)
        })
    })
}