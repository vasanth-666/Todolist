const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('views',__dirname+'/views')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemSchema);


const defaultItems = [
    { name: 'Name' }
];


app.get('/', async (req, res) => {
    try {
        const foundItems = await Item.find({});
        if (foundItems.length === 0) {
            await Item.insertMany(defaultItems);
            console.log('Successfully saved default items to DB.');
            res.redirect('/');
        } else {
            res.render('list', { listTitle: 'TodoList', newListItems: foundItems });
        }
    } catch (err) {
        console.log(err);
    }
});


app.post('/', async (req, res) => {
    const itemName = req.body.newItem;
    const item = new Item({ name: itemName });

    try {
        await item.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});


app.get('/delete/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const foundItem = await Item.findById(itemId);
        res.render('delete', { item: foundItem });
    } catch (err) {
        console.log(err);
    }
});


app.delete('/delete/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        await Item.findByIdAndDelete(itemId);
        console.log('Successfully deleted item.');
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});


app.get('/edit/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const foundItem = await Item.findById(itemId);
        res.render('edit', { item: foundItem });
    } catch (err) {
        console.log(err);
    }
});


app.put('/edit/:id', async (req, res) => {
    const itemId = req.params.id;
    const updatedName = req.body.name;

    try {
        await Item.findByIdAndUpdate(itemId, { name: updatedName });
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
