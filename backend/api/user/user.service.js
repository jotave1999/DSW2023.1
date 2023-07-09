const dbService = require('../../service/db.service')
const logger = require('../../service/logger.service');
const { makeId } = require('../../service/utils.service');
const ObjectId = require('mongodb').ObjectId
const nodemailer = require('nodemailer');

const collectionDb = 'user';

async function query(params) {
    try {
        const sort = _buildSortCriteria(params);
        const filter = _buildFilterCriteria(params);
        const collection = await dbService.getCollection(collectionDb);
        let items = await collection.find(filter).sort(sort);
        let total = await items.count();
        let page = _resultPage(params, total);
        if (page) items.skip(page.index * page.size).limit(page.index * page.size + page.size);
        let users = await items.toArray();
        users.map(user => {
            delete user.password;
            user.createdAt = ObjectId(user._id).getTimestamp();
        });
        const send = {
            users,
            total,
            page,
        };
        return send;
    } catch (err) {
        logger.error(`failed to get items from '${collectionDb}':`, err);
        throw err
    }
}

async function get(params) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        if (params._id) params._id = ObjectId(params._id);
        const user = collection.findOne(params);
        delete user.password;
        user.createdAt = ObjectId(user._id).getTimestamp();
        // add reviews
        return user;
    } catch (err) {
        logger.error(`failed to get user '${id}' from '${collectionDb}':`, err);
        throw err;
    }
}

async function remove(id) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        await collection.deleteOne({ '_id': ObjectId(id) });
        return id;
    } catch (err) {
        logger.error(`failed to remove user '${id}' from '${collectionDb}':`, err);
        throw err;
    }
}

async function add(user) {
    try {
        user = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection(collectionDb);
        return await collection.insertOne(user);
    } catch (err) {
        logger.error('adding failed:', err);
        throw err;
    }
}

async function update(user) {
    try {
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            password: user.password
        }
        const collection = await dbService.getCollection(collectionDb)
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function changePass(user, password) {
    const saltRounds = 10
    logger.debug(`auth.service - change user password: ${user.username}`)
    const hash = await bcrypt.hash(password, saltRounds);
    user.password = hash
    return update(user)
}

async function recoverPass(recoverString, password) {

    try{
        user = await collection.findOne({"recoverString":recoverString})
        const saltRounds = 10
        logger.debug(`auth.service - recover user password: ${user.username}`)
        const hash = await bcrypt.hash(password, saltRounds);
        user.password = hash
        return update(user)
    } catch (err) {
        logger.error(`failed to recover pass to user '${recoverString}' from '${collectionDb}':`, error);
    }
}

async function requestPassRecover(email) {
    try {

        user = await collection.findOne({"email":email})
        recoverString = makeId()
        logger.debug(`auth.service - request user password recover: ${email}`)
       
        user = {...user, "recoverString":recoverString}
        await collection.updateOne({ 'email': email }, { $set: user })


        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "bf3981ec3e1e58",
            pass: "c10a78aee8a58e"
            }
        });

        var recoveryLink = "http://localhost:8080/recover/"+recoverString

        const mailOptions = {
            from: 'trellodsw2023@gmail.com',
            to: email,
            subject: 'Recupere sua senha',
            text: `Clique no link para recuperar sua senha: ${recoveryLink}`,
        };

        logger.debug(`Password recover email sent to ${user.email}`)
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(`failed to request recover pass to user '${email}' from '${collectionDb}':`, error);
        return error
    }
}




function _resultPage({ page }, count) {
    if (page) {
        page = JSON.parse(page);
        page.index ??= 0;
        page.total = Math.ceil(count / page.size);
    }
    return page;
}

function _buildSortCriteria({ sort }) {
    const criteria = {};
    if (sort) {
        sort = JSON.parse(sort);
        criteria[sort.type] = (sort.descending) ? -1 : 1;
    }
    return criteria;
}

function _buildFilterCriteria({ filter }) {
    const criteria = {};
    if (filter) {
        filter = JSON.parse(filter);
        if (filter.name) criteria.name = { $regex: filter.name, $options: 'i' };
        if (filter.tags?.length) criteria.tags = { $elemMatch: { $regex: `^.*(${filter.tags.join('|')}).*$`, $options: 'i' } }
        if (filter.inStock !== null) criteria.inStock = { inStock: { $eq: filter.inStock } };
    }
    return criteria;
}

module.exports = {
    remove,
    query,
    get,
    add,
    update,
    changePass,
    recoverPass,
    requestPassRecover,
}