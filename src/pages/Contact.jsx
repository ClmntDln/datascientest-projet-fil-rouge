const Contact = () => {
    return (
        <section className='contact-container container-narrow'>
            <h1 className='contact-title'>Votre avis compte !</h1>
            <p className='contact-description'>Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez et ce que nous pourrions améliorer. Vos suggestions nous aident à faire de ce blog une ressource toujours plus utile et enrichissante.</p>
            
            <form className='contact-form'>
                <div className='contact-form-group'>
                    <label htmlFor="name" className='contact-label'>Nom</label>
                    <input type="text" id="name" name="name" className='contact-input' placeholder="Votre nom" required />
                </div>
                
                <div className='contact-form-group'>
                    <label htmlFor="email" className='contact-label'>Email</label>
                    <input type="email" id="email" name="email" className='contact-input' required />
                </div>
                
                <div className='contact-form-group'>
                    <label htmlFor="subject" className='contact-label'>Sujet</label>
                    <input type="text" id="subject" name="subject" className='contact-input' required />
                </div>
                
                <div className='contact-form-group'>
                    <label htmlFor="message" className='contact-label'>Message</label>
                    <textarea id="message" name="message" rows="6" className='contact-textarea' required></textarea>
                </div>
                
                <button type="submit" className='contact-button'>Envoyer le message</button>
            </form>
        </section>
    );
};

export default Contact;
