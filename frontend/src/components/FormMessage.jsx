const FormMessage = ({ type = 'error', message }) => {
    if (!message) return null;

    return (
        <div className={type === 'success' ? 'form-success' : 'form-error'} role="alert">
            {message}
        </div>
    );
};

export default FormMessage;
