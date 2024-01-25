
const handleDeleteRequest = async () => {
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            headers: {

                'Content-Type': 'application/json',

            },

        });

        if (response.ok) {

            console.log('Deconectat');

        } else {
            console.error('Cerere DELETE eșuată:', response.status);
        }
    } catch (error) {
        console.error('Eroare în timpul cererii DELETE:', error);
    }
};


module.exports = { handleDeleteRequest };
