'use client'
import { Tldraw, Editor } from "@tldraw/tldraw";
import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useCallback, useState } from "react";

import Chatbox from "../chatbox";
import CodeEditor from "../code-editor";
import ErrorBoundary from "../error-boundary";

import { PreviewShapeUtil } from "./PreviewShape";
import { AiDrawerContext } from "./context";
import { makeReal } from "./makereal-core";
import { OPEN_AI_SYSTEM_PROMPT } from "./prompt";

import { useLayoutContext } from "@/layout/turbo-layout/context";

import '@tldraw/tldraw/tldraw.css';

export interface AiDrawerProps {
    className?: string;
}
const shapeUtils = [PreviewShapeUtil];
export default function AiDrawer({ className }: AiDrawerProps) {
    const { showMessage } = useLayoutContext();
    const [editor, setEditor] = useState<Editor>()
    const [html, setHtml] = useState<string>('')

    const onExport = useCallback(async (prompt: string) => {
        try {
            if (!editor) throw Error('No Editor!')
            await makeReal(editor, prompt)
        } catch (e: any) {
            showMessage({
                type: 'error',
                message: e.message,
            });
        }
    }, [editor])

    return (
        <AiDrawerContext.Provider value={{ setHtml }}>
            <Splitter className={`h-full overflow-auto ${className || ''}`} layout="vertical">
                <SplitterPanel className="px-[7px] " size={70}>
                    <Splitter className={`h-full overflow-auto ${className || ''}`} layout='horizontal'>
                        <SplitterPanel className="px-[7px] " size={65}>
                            <ErrorBoundary>
                                <Tldraw
                                    className={`rounded-std-sm`}
                                    onMount={e => setEditor(e)}
                                    shapeUtils={shapeUtils}
                                />
                            </ErrorBoundary>
                        </SplitterPanel>
                        <SplitterPanel className="px-[7px] " size={35}>
                            <CodeEditor
                                hiddenBar
                                language={'html'}
                                className='grow border-solid border-light-weak rounded-std-sm'
                                value={html}
                                options={{
                                    readOnly: true,
                                    automaticLayout: true,
                                }}

                            />
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
                <SplitterPanel className="overflow-auto px-[7px]" size={30}>
                    <Chatbox
                        initialValue={OPEN_AI_SYSTEM_PROMPT}
                        buttonLabel="Make Real"
                        onSend={(content) => {
                            onExport(content || '')
                        }}
                        extention={
                            ({ setContent }) =>
                                <Button
                                    severity='info'
                                    onClick={() => setContent(OPEN_AI_SYSTEM_PROMPT)}>Apply Default Prompt
                                </Button>
                        }
                    />
                </SplitterPanel>
            </Splitter>
        </AiDrawerContext.Provider>
    )
}