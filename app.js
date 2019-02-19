const express = require('express');
const app = express();
const {User} = require('./db').Models;
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));


app.get('/', (req, res, next) => {
    res.redirect('/users');
});

app.get('/users', (req, res, next) => {
    User.findAll()
        .then( (theUsers) => res.send(`
        <html>
            <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></head>
            <body>
                <h1>
                    Acme Users SEQ_CRUD
                </h1>
                <div class='container'>
                <ul class='list-group'>
                    ${theUsers.map( user => `<li class='list-group-item'>
                        <a href='/users/${user.id}'>${user.firstName} ${user.lastName}</a>
                        <form method='post' action="/users/${user.id}?_method=put">
                            <button class='btn btn-link'></button>
                        </form>
                        <form method='post' action="/users/${user.id}?_method=delete">
                        <button class='btn btn-danger'>Delete</button>
                    </form>
                    </li>`).join('')}
                </ul>
                </div>
                <div class='container'>
                    <form method='post' action='/users'>
                        <input type="text" name="firstName" />
                        <input type="text" name="lastName" />
                        <button type='submit'>Create</button>
                        <input type='reset' value='Cancel'>
                    </form>
                </div>
            </body>
        </html>
        `))
        .catch( (e) => console.log('page could not render' + e))
})

app.get('/users/:id', async (req, res, next) => {
    try { const currentUser = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    User.findAll()
    .then( (theUsers) => res.send(`
    <html>
        <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></head>
        <body>
            <h1>
                Acme Users SEQ_CRUD
            </h1>
            <div class='container'>
            <ul class='list-group'>
                ${theUsers.map( user => `<li class='list-group-item'>
                    <a href='/users/${user.id}'>${user.firstName} ${user.lastName}</a>
                    <form method='post' action="/users/${user.id}?_method=delete">
                    <button class='btn btn-danger'>Delete</button>
                </form>
                </li>`).join('')}
            </ul>
            </div>
            <div class='container'>
                <form method='post' action='/users/${currentUser.id}?_method=put'>
                    <input type="text" name="firstName" value="${currentUser.firstName}" />
                    <input type="text" name="lastName" value="${currentUser.lastName}" />
                    <button type='submit'>Update</button>
                    <a href='/users'>Cancel</a>
                </form>
            </div>
        </body>
    </html>
    `))
    .catch( (e) => console.log('page could not render' + e))
} catch (e) { next(e) }

})
app.post('/users', (req, res, next) => {
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })
        .then( () => res.redirect('/users'))
        .catch(next)
})

app.delete('/users/:id', (req, res, next) => {
    const thisId = req.params.id * 1;
    User.destroy({
        where: {
            id: thisId
        }
    })
        .then( () => res.redirect('/users'))
        .catch(next)
}) 

app.put('/users/:id', (req, res, next) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then( (user) => {
            return user.update( {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            })
        })
        .then( () => res.redirect('/users'))
        .catch(next)
}) 

module.exports = app;