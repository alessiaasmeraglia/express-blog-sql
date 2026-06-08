import connection from '../db/connection.js';

async function index(req, res, next) {
    try {
        const [posts] = await connection.query('SELECT * FROM posts');

        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        const { id } = req.params;

        await connection.query(
            'DELETE FROM post_tag WHERE post_id = ?',
            [id]
        );

        const [result] = await connection.query(
            'DELETE FROM posts WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Post non trovato',
            });
        }

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

export default {
    index,
    destroy
};