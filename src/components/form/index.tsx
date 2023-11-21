import { classNames } from "primereact/utils";
import React, { useEffect } from "react";
import { Controller, Path, } from "react-hook-form";

import { FormItemProps, FormProps, FormValue, GetItemProps } from "./form";
import { useForm } from "./helper";

function GetItem<T extends FormValue>({ formCore, className }: GetItemProps<T>) {
    const { control, formState: { errors } } = formCore;
    const getFormErrorMessage = (name: Path<T>): React.ReactNode => {
        const msg: string = errors[name]?.message as string || ''
        return <>{msg && <small className="p-error">{msg}</small>}</>
    };

    return function FormItem({ children, name, label, rules, valuePropName = 'value' }: FormItemProps<T>) {
        return (
            <div className={`mt-[28px] ${className || ''}`}>
                <span className="p-float-label">
                    <Controller name={name} control={control} rules={rules} render={typeof children === 'function' ? children : ({ field, fieldState }) => (
                        React.cloneElement(children, {
                            id: field.name,
                            ...field,
                            [valuePropName]: field.value,
                            className: `${classNames({ 'p-invalid': fieldState.invalid, })} ${children?.props?.className || 'w-full'}`
                        })
                    )} />

                    <label htmlFor={name} className={classNames({ 'p-error': errors?.[name] })}>{label || name}</label>
                </span>
                {getFormErrorMessage(name)}
            </div>
        )
    }
}



export default function Form<T extends Record<string, any>>(props: FormProps<T>) {
    const {
        form,
        defaultValues,
        children,
        onLoad,
        className,
        itemClassName,
        onDestroyed
    } = props;

    const { form: formInstance } = useForm<T>(form, defaultValues);

    const itemElem = GetItem({ formCore: formInstance.formCore, className: itemClassName });
    useEffect(() => {
        onLoad?.(formInstance);
        return onDestroyed
    }, [])

    return <form className={`zd-form text-deep ${className}`}>
        {children(itemElem)}
    </form>
}


