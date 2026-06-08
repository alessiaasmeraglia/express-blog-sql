import connection from '../db/connection.js';

async function index(req, res, next) {
    try {
        const [posts] = await connection.query('SELECT * FROM posts');

        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function show(req, res, next) {
    try {
        const { id } = req.params;

        const [posts] = await connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                error: 'Post non trovato',
            });
        }

        const [tags] = await connection.query(
            `
        SELECT tags.*
        FROM tags
        JOIN post_tag
         ON tags.id = post_tag.tag_id
        WHERE post_tag.post_id = ?
      `,
            [id]
        );

        const post = posts[0];
        post.tags = tags;

        res.json(posts[0]);
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const { title, content, image, tags } = req.body;

        const [result] = await connection.query(
            `
        INSERT INTO posts (title, content, image)
        VALUES (?, ?, ?)
      `,
            [title, content, image]
        );

        const newPostId = result.insertId;

        if (tags && tags.length > 0) {
            const values = tags.map((tagId) => [newPostId, tagId]);

            await connection.query(
                `
          INSERT INTO post_tag (post_id, tag_id)
          VALUES ?
        `,
                [values]
            );
        }

        const [posts] = await connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [newPostId]
        );

        const [postTags] = await connection.query(
            `
        SELECT tags.*
        FROM tags
        JOIN post_tag
          ON tags.id = post_tag.tag_id
        WHERE post_tag.post_id = ?
      `,
            [newPostId]
        );

        const post = posts[0];
        post.tags = postTags;

        res.status(201).json(post);
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
    show,
    store,
    destroy
};