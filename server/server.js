const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const posts = [
  {
    "title": "Post 1",
    "text": "Baza danych przechowuje informacje w strukturalny sposób.",
    "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "id": "64549b5362f53f833c89f6ab"
  },
  {
    "title": "Post 2",
    "text": "Sieć komputerowa umożliwia przesyłanie danych między urządzeniami.",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bbcbf",
    "id": "64549b6362f53f833c89f6ad"
  },
  {
    "title": "Post 3",
    "text": "Cyberbezpieczeństwo jest ważne w dzisiejszej erze cyfrowej.",
    "image": "https://images.unsplash.com/photo-1563206767-5b1d972b9fb9",
    "id": "64549b6662f53f833c89f6ae"
  },
  {
    "title": "Post 4",
    "text": "Cyberbezpieczeństwo jest ważne w dzisiejszej erze cyfrowej.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b6662f53f833c89f6ae"
  },
  {
    "title": "Post 5",
    "text": "Algorytmy są podstawą rozwiązywania problemów informatycznych.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b6962f53f833c89f6af"
  },
  {
    "title": "Post 6",
    "text": "Chmura obliczeniowa umożliwia przechowywanie danych online.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b6d62f53f833c89f6b0"
  },
  {
    "title": "Post 7",
    "text": "Aplikacja mobilna ułatwia korzystanie z usług na smartfonie.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b7062f53f833c89f6b1"
  },
  {
    "title": "Post 8",
    "text": "Sztuczna inteligencja rewolucjonizuje wiele dziedzin, w tym medycynę i transport.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b7362f53f833c89f6b2"
  },
  {
    "title": "Post 9",
    "text": "Programowanie to sztuka tworzenia oprogramowania.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "64549b7762f53f833c89f6b3"
  },
  {
    "title": "Post 10",
    "text": "Kryptografia zajmuje się zabezpieczaniem danych przed nieautoryzowanym dostępem.",
    "image": "https://www.pandasecurity.com/en/mediacenter/src/uploads/2013/11/pandasecurity-facebook-photo-privacy.jpg",
    "id": "645e329db1979e2e900a94d5"
  }
];

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = posts.find(p => p.id === id);

  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Nie znaleziono posta');
  }
});

app.listen(PORT, () => {
  console.log(`Serwer backendu działa na porcie ${PORT}`);
  console.log(`Dostępny pod adresem: http://127.0.0.1:${PORT}/api/posts`);
});