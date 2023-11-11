import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { flowInfoMap } from "../configuration";

import { IFlow } from '@/interface/workflow';

function TurboNodeInstance(elm: NodeProps<IFlow>) {
    const { id, data, isConnectable, } = elm;
    const { running } = data || {}
    const { icon } = flowInfoMap[data.type] || {}
    let bg_color = 'bg-deep-weak';
    switch (data.status) {
        case 'success': bg_color = 'bg-success-deep'; break;
        case 'failure': bg_color = 'bg-failure-deep'; break;
        default: bg_color = 'bg-deep-weak'; break;
    }

    return (
        <>
            <div className="cloud gradient text-light-weak hover:text-light cursor-default">
                <div className='bg-deep-weak flex-center'>
                    <FontAwesomeIcon className='icon flex-center ' icon={faCloud} />
                </div>
            </div>
            <div className={`middle wrapper gradient rounded-std-sm flex-center flex-col gap-[5px] ${running ? "running" : ''}`} >
                <div className={`inner rounded-std-sm ${bg_color}`}>
                    <div className="body rounded-std-sm text-light">
                        <FontAwesomeIcon className='icon mr-[8px]' icon={icon} color={'white'} />
                        <div>
                            <div className="title">{data.name}</div>
                            <div className="subline">{data.type}</div>
                        </div>
                    </div>
                </div>
            </div >
            <Handle
                className='turbo-handle'
                type="target"
                position={Position.Left}
                id={`tgt-${id}`}
                onConnect={(): void => {
                    alert('haha')
                }}
                isConnectable={isConnectable}
            />
            <Handle
                className='turbo-handle'
                type="source"
                position={Position.Right}
                id={`src-${id}`}
                isConnectable={isConnectable}
            />
        </>
    );
}
const TurboNode = React.memo(TurboNodeInstance)
export default TurboNode