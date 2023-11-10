import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';

import { mock_projects } from '@/app/mock';
import Table from '@/components/table';
import { Column } from '@/components/table/table';
import { IProject } from '@/interface/project';


export default function ProjectViewer() {

    const columns: Column<IProject>[] = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' }
    ]


    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <div className="rounded-std std-title-pane">
            Project List
            <div className="act-pane">
                <Button icon={<FontAwesomeIcon icon={faAdd} />}
                    severity="success"
                    tooltip="Save as template"
                    tooltipOptions={{ position: 'left' }} />
            </div>
        </div>
        <Table className='' data={mock_projects} columns={columns}
            paginator rows={10}
            first={0}
            totalRecords={5}
            onRowClick={(row) => {
                console.log(row)
            }}
        />
    </div>
}