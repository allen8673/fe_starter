import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

export interface ModalProps {
    title?: string;
    onOk?: () => void;
    onCancel?: () => void;
    okLabel?: string;
    cancelLabel?: string;
    cancelByMask?: boolean;
    visible?: boolean;
    stickyContentOnClose?: boolean
}

export default function Modal({ children, title, onOk, onCancel, okLabel, cancelLabel, cancelByMask, visible, stickyContentOnClose, }: React.PropsWithChildren<ModalProps>) {
    return <Dialog
        header={title}
        onHide={() => { }}
        closable={false}
        footer={
            <div>
                <Button label={cancelLabel || 'Cancel'} severity='danger' icon="pi pi-times" onClick={onCancel} />
                <Button label={okLabel || 'OK'} severity='success' icon="pi pi-check" onClick={onOk} />
            </div>}
        visible={visible}
        style={{ width: '50vw' }}
        modal
        onMaskClick={cancelByMask ? onCancel : undefined}
    >
        {(visible || stickyContentOnClose) && children}
    </Dialog>
}