const Login = () => {
    return (
        <section className='login-container container-narrow'>
            <h1 className='login-title'>Connexion</h1>
            <p className='login-description'>Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.</p>
            
            <form className='login-form'>
                <div className='login-form-group'>
                    <label htmlFor="email" className='login-label'>Email</label>
                    <input type="email" id="email" name="email" className='login-input' required />
                </div>
                
                <div className='login-form-group'>
                    <label htmlFor="password" className='login-label'>Mot de passe</label>
                    <input type="password" id="password" name="password" className='login-input' required />
                </div>
                
                <div className='login-form-options'>
                    <label className='login-checkbox-label'>
                        <input type="checkbox" className='login-checkbox' />
                        Se souvenir de moi
                    </label>
                    <a href="#" className='login-forgot-link'>Mot de passe oublié ?</a>
                </div>
                
                <button type="submit" className='login-button'>Se connecter</button>
                
                <p className='login-signup'>
                    Pas encore de compte ? <a href="#" className='login-signup-link'>Créer un compte</a>
                </p>
            </form>
        </section>
    );
};

export default Login;
