'use client'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, toString } from 'lodash';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { SelectItem } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react'

import { useLayoutContext } from '../turbo-layout/context';

import { WfLayoutContext } from './context';

import { getFlow } from '@/api-helpers/flow-api';
import { downloadJob, getJobs, runReport } from '@/api-helpers/report-api';
import EmptyPane from '@/components/empty-pane';
import FileUploader from '@/components/file-uploader';
import { ifWorkflowIsCompleted } from '@/components/flow-editor/helper';
import Modal from '@/components/modal';
import { IJob } from '@/interface/job';
import { IWorkflow } from '@/interface/workflow';
import { downloadString } from '@/utils';

interface ViewReports {
    workflowId: string;
    jobs: IJob[];
}


function PreviewModal({ reportJobs, onClose }:
    {
        reportJobs: ViewReports,
        onClose: () => void
    }) {

    const { showMessage } = useLayoutContext();
    const [jobContents, setJobContents] = useState<{ [id: string]: any }>({});
    const [selectedJob, setSelectedJob] = useState<string>('');

    useEffect(() => {
        setSelectedJob(reportJobs.jobs?.[0]?.JOB_ID || '')
    }, [reportJobs])

    useEffect(() => {
        if (!selectedJob || !!jobContents[selectedJob]) return;
        downloadJob(selectedJob)
            .then(data => {
                if (data?.status_code === 404) {
                    throw (data.detail)
                }
                setJobContents(pre => {
                    pre[selectedJob] = typeof data === 'string' ? data : JSON.stringify(data)
                    return { ...pre }
                })

            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            });
    }, [selectedJob])

    return <Modal
        className="preview-doc-moda min-w-[50%] min-h-[50%] max-w-[70%]"
        onOk={onClose}
        okLabel="Close"
        visible={!!true}
        contentClassName="flex flex-col gap-[22px]"
        footerClass="flex justify-end"
    >
        <div className='flex gap-[7px] p'>
            <Dropdown
                className='grow'
                value={selectedJob}
                options={map<IJob, SelectItem>(reportJobs?.jobs || [], ({ JOB_ID }) => ({ label: JOB_ID, value: JOB_ID }))}
                onChange={v => {
                    setSelectedJob(v.value)
                }}
            />
            <Button
                className="gap-[7px]"
                severity='info'
                label={'Download'}
                disabled={!jobContents[selectedJob]}
                icon={<FontAwesomeIcon icon={faDownload} />}
                onClick={(): void => {
                    if (!jobContents[selectedJob]) return
                    downloadString(jobContents[selectedJob], selectedJob, 'txt')
                }}
            />
        </div>
        {jobContents[selectedJob] ? <Fieldset legend="Preview your report" className="grow" >
            {jobContents[selectedJob]}
        </Fieldset> : <EmptyPane />}

    </Modal>

}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showMessage } = useLayoutContext();
    const [runningWF, setRunningWF] = useState<IWorkflow>();
    const [reportJobs, setReportJobs] = useState<ViewReports>();

    const runWorkflow = async (wf?: IWorkflow | string) => {
        if (!wf) return;
        const workflow: IWorkflow | undefined = typeof wf === 'string' ? await getFlow(wf) : wf

        if (!ifWorkflowIsCompleted(workflow?.flows)) {
            showMessage({
                message: `Cannot run '${workflow?.name}'(${workflow?.id}) since the workflow is not completed.`,
                type: 'error'
            })
            return
        }
        setRunningWF(workflow)
    }
    const viewReports = (workflowId: string) => {
        setReportJobs({ workflowId, jobs: [] });
        getJobs(workflowId)
            .then(res => {
                setReportJobs(() => {
                    return {
                        workflowId, jobs: (res.data || [])
                    };
                })
            }).catch((error) => {
                showMessage({
                    message: toString(error),
                    type: 'error'
                })
            })
    }

    return (
        <WfLayoutContext.Provider value={{
            runWorkflow,
            viewReports,
        }}>
            {children}
            <Modal
                title="Upload your files"
                visible={!!runningWF}
                onOk={() => setRunningWF(undefined)}
                footerClass="flex justify-end"
                okLabel="Cancel"
            >
                <FileUploader
                    uploadLabel="Upload & Run"
                    onUpload={e => {
                        if (runningWF && e.files && e.files.length > 0) {
                            const formData = new FormData();
                            for (const i in e.files) {
                                formData.append('files', e.files[i])
                            }

                            formData.append('userId', '23224');
                            formData.append('workflowId', runningWF.id);
                            formData.append('version', '1');

                            runReport(formData).then((res) => {
                                showMessage({
                                    message: res.message || 'success',
                                    type: 'success'
                                })
                                setRunningWF(undefined);
                            }).catch((error) => {
                                showMessage({
                                    message: toString(error),
                                    type: 'error'
                                })
                            });
                        }
                    }}
                />
            </Modal>
            {reportJobs && <PreviewModal reportJobs={reportJobs} onClose={() => setReportJobs(undefined)} />}
        </WfLayoutContext.Provider>
    )
}