'use client'
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { map } from "lodash";
import { useRouter } from "next/dist/client/components/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SelectItem } from "primereact/selectitem";
import { useEffect, useState } from 'react'

import apiCaller from "@/api-helpers/api-caller";
import { coverToQueryString } from "@/api-helpers/url-helper";
import Form from "@/components/form";
import { FormInstance } from "@/components/form/form";
import Modal from "@/components/modal";
import Table from "@/components/table";
import { Column } from "@/components/table/table";
import TitlePane from "@/components/title-pane";
import { ITemplate, IWorkflow } from "@/interface/workflow";
import RouterInfo, { getFullUrl } from "@/settings/router-setting";

interface FormData {
    id?: string;
    name?: string;
    template?: string
    // template?: { value: string }[];
}

export default function Page() {

    const [workflows, setWorkflow] = useState<IWorkflow[]>([]);
    const [addNewFlow, setAddNewFlow] = useState<boolean>();
    const [form, setForm] = useState<FormInstance<FormData>>()
    const [templateOpts, setTemplateOpts] = useState<SelectItem[]>([])

    const router = useRouter();
    const editorUrl = getFullUrl(RouterInfo.WORKFLOW_EDITOR);

    const getTemplateOpts = async () => {
        const res = await apiCaller.get(`${process.env.NEXT_PUBLIC_TEMPLATE_API}`);
        const opts = map<ITemplate, SelectItem>(res.data || [], t => ({ label: t.name, value: t.id }))
        setTemplateOpts(opts)
    }

    const getWorkflows = async () => {
        const rsp = await apiCaller.get<IWorkflow[]>(`${process.env.NEXT_PUBLIC_WORKFLOW_API}`);
        setWorkflow(rsp.data)
    }

    useEffect(() => {
        getWorkflows()
        getTemplateOpts()
    }, [])

    const columns: Column<IWorkflow>[] = [
        { key: 'id', title: 'ID', style: { width: '25%' } },
        { key: 'name', title: 'Name' }
    ]

    return <div className="flex h-full flex-col gap-std items-stretch text-light">
        <TitlePane
            title='WorkFlow List'
            postContent={
                <Button icon={<FontAwesomeIcon className='mr-[7px]' icon={faAdd} />}
                    severity="success"
                    label='Add New Workflow'
                    tooltipOptions={{ position: 'left' }}
                    onClick={() => {
                        setAddNewFlow(pre => !pre)
                    }}
                />
            }
        />
        <Table className='h-full' data={workflows} columns={columns}
            paginator rows={10}
            first={0}
            totalRecords={5}
            onRowClick={({ data }) => {
                const { id } = data
                router.push(`${editorUrl}${coverToQueryString({ id })}`);
            }}
        />
        <Modal visible={addNewFlow}
            onOk={() => {
                form?.submit()
                    .then(({ name, template }) => {
                        const queries: { [key: string]: string | undefined } = { name, template }
                        // if (!!template?.length) {
                        //     queries.template = template.map(t => t.value).join(',')
                        // }
                        router.push(`${editorUrl}${coverToQueryString(queries)}`);
                    }).catch(() => {
                        // 
                    });
            }}
            onCancel={() => {
                setAddNewFlow(false)
            }}>
            <Form
                onLoad={(form: FormInstance<FormData>) => {
                    setForm(form)
                }}
                onDestroyed={() => {
                    setForm(undefined)
                }}
            >
                {
                    ({ Item }) => (
                        <>
                            <Item name={'name'} label="Workflow Name" rules={{ required: 'Please give a name to workflow!', }}>
                                <InputText />
                            </Item>
                            <Item name={'template'} label="Template">
                                <Dropdown options={templateOpts} />
                            </Item>

                            {/* <List name='template' label="Template">{({ fields, append, remove, move }) => {
                                return <>
                                    <DndList
                                        items={fields}
                                        renderContent={(item, idx) => {
                                            return <div className="flex w-full mt-1">
                                                <Item className="grow" name={`template.${idx}.value`}>
                                                    <Dropdown options={templateOpts} />
                                                </Item>
                                                <Button
                                                    type='button'
                                                    severity='danger'
                                                    className="ml-1"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    onClick={(): void => {
                                                        remove(idx)
                                                    }}
                                                />
                                            </div>
                                        }}
                                        onDragEnd={({ source, destination }) => {
                                            if (destination?.index === undefined) return;
                                            move(source.index, destination.index)
                                        }}
                                    />
                                    <Button
                                        type='button'
                                        className="mt-2 w-full"
                                        icon={<FontAwesomeIcon icon={faAdd} />}
                                        onClick={(): void => {
                                            append({ value: '' })
                                        }}
                                    />
                                </>
                            }}
                            </List> */}
                        </>
                    )
                }</Form>
        </Modal>
    </div >
}
