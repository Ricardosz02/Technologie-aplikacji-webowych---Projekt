const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/blogdb')
  .then(() => console.log('Połączono z MongoDB'))
  .catch(err => console.error('Błąd połączenia z MongoDB:', err));

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: String, default: 'Użytkownik' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', CommentSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  text: String,
  image: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  likes: { type: [String], default: [] },
  likesCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
});
const Post = mongoose.model('Post', PostSchema);

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.filter || '';

    const query = filter ? {
      $or: [
        { title: { $regex: filter, $options: 'i' } },
        { text: { $regex: filter, $options: 'i' } }
      ]
    } : {};

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts: posts,
      totalPosts: totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.views = (post.views || 0) + 1;
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: 'Post nie znaleziony' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, text, image, authorId } = req.body;
    const newPost = new Post({
      title: title,
      text: text,
      image: image,
      authorId: authorId
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/auth', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login: login, password: password });

  if (user) {
    res.json({
      token: 'fake-jwt-token-123456789',
      userId: user._id.toString()
    });
  } else {
    res.status(401).json({ error: 'Błędny login lub hasło' });
  }
});

app.post('/api/user/create', async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.login = req.body.email;
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/user/logout/:id', (req, res) => {
  res.status(200).json({ message: 'Wylogowano' });
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId || '1';

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post nie znaleziony' });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: 'Post już polubiony' });
    }

    post.likes.push(userId);
    post.likesCount = post.likes.length;
    await post.save();

    res.json({
      message: 'Post polubiony',
      likesCount: post.likesCount,
      likes: post.likes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId || '1';

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post nie znaleziony' });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: 'Post nie był polubiony' });
    }

    post.likes = post.likes.filter(id => id !== userId);
    post.likesCount = post.likes.length;
    await post.save();

    res.json({
      message: 'Like usunięty',
      likesCount: post.likesCount,
      likes: post.likes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/migrate-views', async (req, res) => {
  try {
    const result = await Post.updateMany(
      { views: { $exists: false } },
      { $set: { views: 0 } }
    );
    res.json({
      message: 'Views migration completed',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/migrate-likes', async (req, res) => {
  try {
    const result = await Post.updateMany(
      { likes: { $exists: false } },
      {
        $set: {
          likes: [],
          likesCount: 0
        }
      }
    );
    res.json({
      message: 'Migration completed',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { postId, userId, author, text } = req.body;
    const newComment = new Comment({ postId, userId, author, text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const userId = req.body.userId;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Komentarz nie znaleziony' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia tego komentarza' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Komentarz usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    const postsCount = await Post.countDocuments({ authorId: req.params.id });

    res.json({
      ...user.toObject(),
      postsCount: postsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.id }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email jest wymagany' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/migrate-user-dates', async (req, res) => {
  try {
    const result = await User.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: new Date() } }
    );
    res.json({
      message: 'Migracja dat użytkowników zakończona',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/migrate-posts-author', async (req, res) => {
  try {
    const firstUser = await User.findOne();
    if (!firstUser) {
      return res.status(400).json({ error: 'Brak użytkowników w bazie danych' });
    }

    const result = await Post.updateMany(
      { authorId: { $exists: false } },
      { $set: { authorId: firstUser._id } }
    );
    res.json({
      message: 'Migracja postów zakończona',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/migrate-comments', async (req, res) => {
  try {
    const firstUser = await User.findOne();
    if (!firstUser) {
      return res.status(400).json({ error: 'Brak użytkowników w bazie danych' });
    }

    const result = await Comment.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: firstUser._id } }
    );
    res.json({
      message: 'Migracja komentarzy zakończona',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer backendowy działa na porcie ${PORT}`);
});