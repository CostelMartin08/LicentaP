
module.exports = {
    getCurrentDateTime: function () {
        const dataCurenta = new Date();
        const an = dataCurenta.getFullYear();
        const luna = dataCurenta.getMonth() + 1;
        const zi = dataCurenta.getDate();
        const ora = dataCurenta.getHours();
        const minute = dataCurenta.getMinutes();
        const secunde = dataCurenta.getSeconds();

        return `${an}-${luna < 10 ? '0' : ''}${luna}-${zi < 10 ? '0' : ''}${zi} ${ora < 10 ? '0' : ''}${ora}:${minute < 10 ? '0' : ''}${minute}:${secunde < 10 ? '0' : ''}${secunde}`;
    }
};
