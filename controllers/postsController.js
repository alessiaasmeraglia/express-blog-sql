import connection from '../db/connection.js';

async function index(req, res, next) {
    try {
        const [posts] = await connection.query('SELECT * FROM posts');

        res.json(posts);
    } catch (error) {
        next(error);
    }
}

export default {
    index,
};