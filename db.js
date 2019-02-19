const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, { logging: false });

const User = db.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const syncAndSeed = () => {
    return db.sync({ force: true })
        .then( async () => {
            const [bubbles, buttercup, blossom] = await Promise.all([
                User.create({ firstName: 'Bubbles', lastName: 'Powerpuff'}),
                User.create({ firstName: 'Buttercup', lastName: 'Powerpuff'}),
                User.create({ firstName: 'Blossom', lastName: 'Powerpuff'})]
        )})
        .then( () => console.log('users created'))
        .catch( (e) => console.log('Uh-Oh!!!' + e))
}

module.exports = { 
    Models: {
        User
    },
    syncAndSeed
}
