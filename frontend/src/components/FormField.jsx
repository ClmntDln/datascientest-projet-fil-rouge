const FormField = ({ id, label, as = 'input', children, ...props }) => {
    const Tag = as;

    return (
        <div className="form-group">
            <label htmlFor={id} className="form-label">{label}</label>
            {as === 'textarea' ? (
                <Tag id={id} className="form-textarea" {...props} />
            ) : (
                <Tag id={id} className="form-input" {...props} />
            )}
            {children}
        </div>
    );
};

export default FormField;
