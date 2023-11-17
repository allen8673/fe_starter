
import { ITemplate, IWorkflow } from "@/interface/workflow";


export const mock_projects: IWorkflow[] = [
    {
        id: 'p-1',
        name: 'project 1',
        flows: [
            {
                id: 'f-1',
                name: 'Upload',
                type: 'file-upload',
                position: { x: 100, y: 400 },
                forwards: ['f-2', 'f-4'],
            },
            {
                id: 'f-2',
                name: 'analysis ip',
                type: 'prompt',
                position: { x: 600, y: 500 },
                forwards: ['f-5']

            },
            {
                id: 'f-4',
                name: 'analysis add.',
                type: 'prompt',
                position: { x: 600, y: 300 },
                forwards: ['f-5']
            },
            {
                id: 'f-5',
                name: 'Done',
                type: 'file-download',
                position: { x: 1100, y: 400 },
            }]
    },
    {
        id: 'p-2',
        name: 'project 2',
        flows: []
    }
]

export const mock_template: ITemplate[] = [
    {
        id: 'temp-1',
        name: 'Template 1',
        flows: []
    }
]