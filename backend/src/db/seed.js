const db = require('./schema');

function seed() {
  const count = db.prepare('SELECT COUNT(*) as c FROM movies').get().c;
  if (count > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding database...');

  // ── Genres ──────────────────────────────────────────────────────────────────
  const genres = [
    'Action', 'Drama', 'Romance', 'Thriller', 'Comedy',
    'Fantasy', 'Historical', 'Crime', 'Family', 'Musical',
  ];
  const insertGenre = db.prepare('INSERT OR IGNORE INTO genres (name) VALUES (?)');
  genres.forEach(g => insertGenre.run(g));

  const genreId = (name) => db.prepare('SELECT id FROM genres WHERE name=?').get(name).id;

  // ── Persons ──────────────────────────────────────────────────────────────────
  const insertPerson = db.prepare(`
    INSERT INTO persons (name, born, birth_place, bio, photo) VALUES (?,?,?,?,?)
  `);

  const persons = [
    // Directors
    {
      name: 'S. S. Rajamouli',
      born: '1973-10-10',
      birth_place: 'Raichur, Karnataka, India',
      bio: 'Shekhar Shankar Rajamouli is an Indian film director and producer known for his grand, visually spectacular films. He is widely regarded as one of the most successful directors in Indian cinema.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/SS_Rajamouli_at_RRR_event.jpg/440px-SS_Rajamouli_at_RRR_event.jpg',
    },
    {
      name: 'Sukumar',
      born: '1975-07-14',
      birth_place: 'Palasa, Andhra Pradesh, India',
      bio: 'Sukumar is a Telugu film director and screenwriter known for his unique storytelling and visual style. He has directed several critically acclaimed and commercially successful films.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Sukumar_at_Pushpa_2_press_meet.jpg/440px-Sukumar_at_Pushpa_2_press_meet.jpg',
    },
    {
      name: 'Trivikram Srinivas',
      born: '1972-11-08',
      birth_place: 'Narasaraopet, Andhra Pradesh, India',
      bio: 'Trivikram Srinivas is a Telugu film director, screenwriter, and lyricist celebrated for his dialogue writing and philosophical storytelling.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Trivikram_Srinivas.jpg/440px-Trivikram_Srinivas.jpg',
    },
    {
      name: 'Sandeep Reddy Vanga',
      born: '1984-09-01',
      birth_place: 'Hyderabad, Telangana, India',
      bio: 'Sandeep Reddy Vanga is an Indian filmmaker known for raw and intense character-driven dramas. His debut Arjun Reddy was a cultural phenomenon.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sandeep_Reddy_Vanga.jpg/440px-Sandeep_Reddy_Vanga.jpg',
    },
    {
      name: 'Chandrasekhar Yeleti',
      born: '1973-01-01',
      birth_place: 'Andhra Pradesh, India',
      bio: 'Chandrasekhar Yeleti is an acclaimed Telugu filmmaker known for intelligent thrillers like Anukokunda Oka Roju and Prayanam.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chandrasekhar_Yeleti.jpg/440px-Chandrasekhar_Yeleti.jpg',
    },
    {
      name: 'Harish Shankar',
      born: '1980-01-01',
      birth_place: 'Hyderabad, Telangana, India',
      bio: 'Harish Shankar is a Telugu film director known for mass entertainers. His films often feature strong action sequences and catchy music.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Harish_Shankar.jpg/440px-Harish_Shankar.jpg',
    },
    {
      name: 'Koratala Siva',
      born: '1975-01-01',
      birth_place: 'Andhra Pradesh, India',
      bio: 'Koratala Siva is a Telugu filmmaker known for socially relevant films that blend mass entertainment with meaningful messages.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Koratala_Siva.jpg/440px-Koratala_Siva.jpg',
    },

    // Actors
    {
      name: 'Prabhas',
      born: '1979-10-23',
      birth_place: 'Undi, Andhra Pradesh, India',
      bio: 'Prabhas is a Telugu actor who became a pan-India star after the massive success of the Baahubali franchise. He is known for his action-hero image and dedication to roles.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Prabhas_in_2019.jpg/440px-Prabhas_in_2019.jpg',
    },
    {
      name: 'Ram Charan',
      born: '1985-03-27',
      birth_place: 'Chennai, Tamil Nadu, India',
      bio: 'Ram Charan Teja is a Telugu actor who starred in the globally successful RRR. He is also a film producer and businessman, and son of veteran actor Chiranjeevi.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Ram_Charan_at_RRR_premiere.jpg/440px-Ram_Charan_at_RRR_premiere.jpg',
    },
    {
      name: 'Jr. NTR',
      born: '1983-05-20',
      birth_place: 'Hyderabad, Andhra Pradesh, India',
      bio: 'Nandamuri Taraka Rama Rao Jr., known as Jr. NTR, is a Telugu actor celebrated for his electrifying screen presence, dance moves, and versatile acting.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Jr_NTR_at_RRR_event.jpg/440px-Jr_NTR_at_RRR_event.jpg',
    },
    {
      name: 'Allu Arjun',
      born: '1982-04-08',
      birth_place: 'Chennai, Tamil Nadu, India',
      bio: 'Allu Arjun is a Telugu actor known as the "Stylish Star". His role in Pushpa: The Rise earned him a National Film Award for Best Actor.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Allu_Arjun_at_Pushpa_2.jpg/440px-Allu_Arjun_at_Pushpa_2.jpg',
    },
    {
      name: 'Mahesh Babu',
      born: '1975-08-09',
      birth_place: 'Chennai, Tamil Nadu, India',
      bio: 'Mahesh Babu is a Telugu actor and producer referred to as the "Prince of Tollywood". He is known for his charming screen presence and action roles.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mahesh_Babu_2023.jpg/440px-Mahesh_Babu_2023.jpg',
    },
    {
      name: 'Vijay Deverakonda',
      born: '1989-05-09',
      birth_place: 'Hyderabad, Telangana, India',
      bio: 'Vijay Deverakonda is a Telugu actor who rose to fame with Arjun Reddy. Known for his raw, intense performances, he is widely regarded as the face of a new era in Tollywood.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Vijay_Deverakonda.jpg/440px-Vijay_Deverakonda.jpg',
    },
    {
      name: 'Rana Daggubati',
      born: '1984-12-14',
      birth_place: 'Chennai, Tamil Nadu, India',
      bio: 'Rana Daggubati is a Telugu actor known for his imposing physicality and versatile roles, most notably Bhallaladeva in the Baahubali franchise.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Rana_Daggubati.jpg/440px-Rana_Daggubati.jpg',
    },
    {
      name: 'Samantha Ruth Prabhu',
      born: '1987-04-28',
      birth_place: 'Chennai, Tamil Nadu, India',
      bio: 'Samantha Ruth Prabhu is one of the most celebrated actresses in Tollywood, known for her natural acting and diverse roles in drama and action films.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Samantha_Ruth_Prabhu_2019.jpg/440px-Samantha_Ruth_Prabhu_2019.jpg',
    },
    {
      name: 'Rashmika Mandanna',
      born: '1996-04-05',
      birth_place: 'Virajpet, Karnataka, India',
      bio: 'Rashmika Mandanna is an actress who has achieved pan-India recognition, especially after Pushpa: The Rise. She is known as the "National Crush" of India.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rashmika_Mandanna.jpg/440px-Rashmika_Mandanna.jpg',
    },
    {
      name: 'Anushka Shetty',
      born: '1981-11-07',
      birth_place: 'Mangalore, Karnataka, India',
      bio: 'Anushka Shetty is a highly acclaimed Telugu actress known for her powerful performances in films like Baahubali and Rudhramadevi.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Anushka_Shetty_2018.jpg/440px-Anushka_Shetty_2018.jpg',
    },
    {
      name: 'Tamannaah Bhatia',
      born: '1989-12-21',
      birth_place: 'Mumbai, Maharashtra, India',
      bio: 'Tamannaah Bhatia is a leading actress in Tollywood known for her versatility across genres, from action to romance to comedy.',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Tamannaah_Bhatia.jpg/440px-Tamannaah_Bhatia.jpg',
    },
  ];

  const personIds = {};
  persons.forEach(p => {
    const result = insertPerson.run(p.name, p.born, p.birth_place, p.bio, p.photo);
    personIds[p.name] = result.lastInsertRowid;
  });

  // ── Movies ───────────────────────────────────────────────────────────────────
  const insertMovie = db.prepare(`
    INSERT INTO movies (title, release_year, duration_min, language, synopsis, poster, banner, imdb_rating, box_office, director_id)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `);
  const insertMovieGenre = db.prepare('INSERT OR IGNORE INTO movie_genres (movie_id, genre_id) VALUES (?,?)');
  const insertCast = db.prepare(`
    INSERT INTO movie_cast (movie_id, person_id, role, role_type) VALUES (?,?,?,?)
  `);

  const moviesData = [
    {
      title: 'Baahubali: The Beginning',
      release_year: 2015,
      duration_min: 159,
      language: 'Telugu',
      synopsis: 'An epic tale of two brothers, the heir to an ancient kingdom must fight to reclaim his rightful throne. Shiva discovers his true destiny while battling mighty adversaries in a world of magic and grandeur.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Baahubali-_The_Beginning.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Baahubali-_The_Beginning.jpg',
      imdb_rating: 8.0,
      box_office: '₹650 crore',
      director: 'S. S. Rajamouli',
      genres: ['Action', 'Fantasy', 'Historical'],
      cast: [
        { name: 'Prabhas', role: 'Baahubali / Shiva', type: 'actor' },
        { name: 'Rana Daggubati', role: 'Bhallaladeva', type: 'actor' },
        { name: 'Anushka Shetty', role: 'Devasena', type: 'actress' },
        { name: 'Tamannaah Bhatia', role: 'Avanthika', type: 'actress' },
      ],
    },
    {
      title: 'Baahubali 2: The Conclusion',
      release_year: 2017,
      duration_min: 167,
      language: 'Telugu',
      synopsis: 'The thrilling conclusion of the Baahubali saga reveals why Kattappa killed Baahubali. Amarendra Baahubali\'s past unfolds as Shiva wages war to reclaim the throne of Mahishmati.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Baahubali_2_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Baahubali_2_poster.jpg',
      imdb_rating: 8.2,
      box_office: '₹1810 crore',
      director: 'S. S. Rajamouli',
      genres: ['Action', 'Fantasy', 'Historical', 'Drama'],
      cast: [
        { name: 'Prabhas', role: 'Baahubali / Shiva', type: 'actor' },
        { name: 'Rana Daggubati', role: 'Bhallaladeva', type: 'actor' },
        { name: 'Anushka Shetty', role: 'Devasena', type: 'actress' },
        { name: 'Tamannaah Bhatia', role: 'Avanthika', type: 'actress' },
      ],
    },
    {
      title: 'RRR',
      release_year: 2022,
      duration_min: 187,
      language: 'Telugu',
      synopsis: 'A fictional story about two legendary freedom fighters, Alluri Sitarama Raju and Komaram Bheem, and their friendship before they went on to fight for their country. An epic action drama set in the 1920s.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/d/d5/RRR_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/d/d5/RRR_poster.jpg',
      imdb_rating: 7.8,
      box_office: '₹1200 crore',
      director: 'S. S. Rajamouli',
      genres: ['Action', 'Historical', 'Drama'],
      cast: [
        { name: 'Ram Charan', role: 'Alluri Sitarama Raju', type: 'actor' },
        { name: 'Jr. NTR', role: 'Komaram Bheem', type: 'actor' },
        { name: 'Alia Bhatt', role: 'Sita', type: 'actress' },
        { name: 'Samantha Ruth Prabhu', role: 'Komaram Bheem\'s friend', type: 'actress' },
      ],
    },
    {
      title: 'Pushpa: The Rise',
      release_year: 2021,
      duration_min: 179,
      language: 'Telugu',
      synopsis: 'Pushpa Raj, a coolie who rises in the red sandalwood smuggling syndicate. A gritty, raw tale of a man who claws his way from the bottom to the top in the dangerous forests of Seshachalam.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Pushpa_The_Rise_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Pushpa_The_Rise_poster.jpg',
      imdb_rating: 7.6,
      box_office: '₹360 crore',
      director: 'Sukumar',
      genres: ['Action', 'Crime', 'Drama'],
      cast: [
        { name: 'Allu Arjun', role: 'Pushpa Raj', type: 'actor' },
        { name: 'Rashmika Mandanna', role: 'Srivalli', type: 'actress' },
        { name: 'Fahadh Faasil', role: 'Bhanwar Singh Shekawat', type: 'actor' },
      ],
    },
    {
      title: 'Arjun Reddy',
      release_year: 2017,
      duration_min: 185,
      language: 'Telugu',
      synopsis: 'A brilliant but self-destructive surgeon descends into alcoholism and substance abuse after his girlfriend is forced to marry someone else. A raw, unapologetic character study.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Arjun_Reddy_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Arjun_Reddy_poster.jpg',
      imdb_rating: 8.1,
      box_office: '₹50 crore',
      director: 'Sandeep Reddy Vanga',
      genres: ['Drama', 'Romance'],
      cast: [
        { name: 'Vijay Deverakonda', role: 'Arjun Reddy', type: 'actor' },
        { name: 'Shalini Pandey', role: 'Preeti', type: 'actress' },
      ],
    },
    {
      title: 'Rangasthalam',
      release_year: 2018,
      duration_min: 170,
      language: 'Telugu',
      synopsis: 'Set in a 1980s village in Andhra Pradesh, two brothers take on a powerful president who has been exploiting the people for 30 years. A period drama with powerful performances.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/b/be/Rangasthalam_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/b/be/Rangasthalam_poster.jpg',
      imdb_rating: 8.1,
      box_office: '₹150 crore',
      director: 'Sukumar',
      genres: ['Action', 'Drama', 'Family'],
      cast: [
        { name: 'Ram Charan', role: 'Chitti Babu', type: 'actor' },
        { name: 'Samantha Ruth Prabhu', role: 'Rama Lakshmi', type: 'actress' },
        { name: 'Aadhi Pinisetty', role: 'Kumari Anna', type: 'actor' },
      ],
    },
    {
      title: 'Magadheera',
      release_year: 2009,
      duration_min: 157,
      language: 'Telugu',
      synopsis: 'A warrior and a princess are reincarnated 400 years later and encounter the descendants of their arch-enemies. A spectacular fantasy action film blending past and present timelines.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/69/Magadheera_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/6/69/Magadheera_poster.jpg',
      imdb_rating: 8.0,
      box_office: '₹150 crore',
      director: 'S. S. Rajamouli',
      genres: ['Action', 'Fantasy', 'Romance'],
      cast: [
        { name: 'Ram Charan', role: 'Harsha / Kala Bhairava', type: 'actor' },
        { name: 'Kajal Aggarwal', role: 'Indu / Mitravinda', type: 'actress' },
      ],
    },
    {
      title: 'Ala Vaikunthapurramuloo',
      release_year: 2020,
      duration_min: 159,
      language: 'Telugu',
      synopsis: 'Bantu, raised as the son of a middle-class man, discovers he was switched at birth with the son of a wealthy businessman. A family entertainer with comedy, drama, and action.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ala_Vaikunthapurramuloo_Poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Ala_Vaikunthapurramuloo_Poster.jpg',
      imdb_rating: 7.3,
      box_office: '₹280 crore',
      director: 'Trivikram Srinivas',
      genres: ['Action', 'Comedy', 'Family', 'Drama'],
      cast: [
        { name: 'Allu Arjun', role: 'Bantu / Raj', type: 'actor' },
        { name: 'Pooja Hegde', role: 'Amulya', type: 'actress' },
        { name: 'Tabu', role: 'Amma', type: 'actress' },
      ],
    },
    {
      title: 'Eega',
      release_year: 2012,
      duration_min: 131,
      language: 'Telugu',
      synopsis: 'A man is murdered by a ruthless businessman and reincarnates as a housefly to seek revenge and protect the woman he loves. An innovative and visually imaginative fantasy revenge thriller.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Eega_Telugu_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Eega_Telugu_poster.jpg',
      imdb_rating: 8.3,
      box_office: '₹100 crore',
      director: 'S. S. Rajamouli',
      genres: ['Fantasy', 'Thriller', 'Romance'],
      cast: [
        { name: 'Nani', role: 'Nani / Eega', type: 'actor' },
        { name: 'Sudeep', role: 'Sudeep', type: 'actor' },
        { name: 'Samantha Ruth Prabhu', role: 'Bindu', type: 'actress' },
      ],
    },
    {
      title: 'Maharshi',
      release_year: 2019,
      duration_min: 179,
      language: 'Telugu',
      synopsis: 'A successful NRI businessman returns to India and transforms his village, while confronting unresolved issues from his past. A feel-good drama about redemption and giving back.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Maharshi_film_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Maharshi_film_poster.jpg',
      imdb_rating: 7.0,
      box_office: '₹233 crore',
      director: 'Vamshi Paidipally',
      genres: ['Drama', 'Family'],
      cast: [
        { name: 'Mahesh Babu', role: 'Rishi Kumar', type: 'actor' },
        { name: 'Pooja Hegde', role: 'Pooja', type: 'actress' },
        { name: 'Allari Naresh', role: 'Rishi\'s friend', type: 'actor' },
      ],
    },
    {
      title: 'Srimanthudu',
      release_year: 2015,
      duration_min: 159,
      language: 'Telugu',
      synopsis: 'Harsha, a wealthy and successful businessman, adopts a village to develop it, and in the process discovers family secrets and falls in love. A social drama with a powerful message.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Srimanthudu_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Srimanthudu_poster.jpg',
      imdb_rating: 7.8,
      box_office: '₹200 crore',
      director: 'Koratala Siva',
      genres: ['Action', 'Drama', 'Romance'],
      cast: [
        { name: 'Mahesh Babu', role: 'Harsha', type: 'actor' },
        { name: 'Shruti Haasan', role: 'Charusheela', type: 'actress' },
      ],
    },
    {
      title: 'Oopiri',
      release_year: 2016,
      duration_min: 140,
      language: 'Telugu',
      synopsis: 'A billionaire who is paralyzed from the neck down hires an unlikely caretaker, and the two form an unlikely bond that transforms both their lives. A remake of the French film The Intouchables.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/7/70/Oopiri_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/7/70/Oopiri_poster.jpg',
      imdb_rating: 8.0,
      box_office: '₹65 crore',
      director: 'Vasu Varma',
      genres: ['Drama', 'Comedy'],
      cast: [
        { name: 'Nagarjuna Akkineni', role: 'Vikram', type: 'actor' },
        { name: 'Karthi', role: 'Seenu', type: 'actor' },
        { name: 'Tamannaah Bhatia', role: 'Meghana', type: 'actress' },
      ],
    },
    {
      title: 'Bheemla Nayak',
      release_year: 2022,
      duration_min: 164,
      language: 'Telugu',
      synopsis: 'A confrontation between a Sub-Inspector and an ex-soldier escalates into a battle of egos with deadly consequences. A powerful action drama about pride, ego, and redemption.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/63/Bheemla_Nayak_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/6/63/Bheemla_Nayak_poster.jpg',
      imdb_rating: 7.5,
      box_office: '₹200 crore',
      director: 'Saagar K Chandra',
      genres: ['Action', 'Drama', 'Thriller'],
      cast: [
        { name: 'Pawan Kalyan', role: 'Bheemla Nayak', type: 'actor' },
        { name: 'Rana Daggubati', role: 'Daniel Shekar', type: 'actor' },
        { name: 'Nithya Menen', role: 'Sita', type: 'actress' },
      ],
    },
    {
      title: 'Vakeel Saab',
      release_year: 2021,
      duration_min: 175,
      language: 'Telugu',
      synopsis: 'A veteran lawyer takes on a case of three women accused of murdering a serial harasser, fighting against a corrupt system. Telugu remake of Pink, a film about consent and justice.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Vakeel_Saab_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Vakeel_Saab_poster.jpg',
      imdb_rating: 7.4,
      box_office: '₹130 crore',
      director: 'Venu Sriram',
      genres: ['Drama', 'Thriller', 'Crime'],
      cast: [
        { name: 'Pawan Kalyan', role: 'Vakeel Saab', type: 'actor' },
        { name: 'Anjali', role: 'Pallavi', type: 'actress' },
        { name: 'Nivetha Thomas', role: 'Zareena', type: 'actress' },
      ],
    },
    {
      title: 'Athadu',
      release_year: 2005,
      duration_min: 152,
      language: 'Telugu',
      synopsis: 'A hitman assumes a dead man\'s identity and gets entangled in a political conspiracy when he is mistaken for the son of a minister. A gripping action thriller.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Athadu_film.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Athadu_film.jpg',
      imdb_rating: 8.1,
      box_office: '₹25 crore',
      director: 'Trivikram Srinivas',
      genres: ['Action', 'Thriller', 'Comedy'],
      cast: [
        { name: 'Mahesh Babu', role: 'Nandu', type: 'actor' },
        { name: 'Trisha Krishnan', role: 'Preeti', type: 'actress' },
      ],
    },
    {
      title: 'Geetha Govindam',
      release_year: 2018,
      duration_min: 131,
      language: 'Telugu',
      synopsis: 'A fun-loving young man accidentally gets a professor assigned as his sister-in-law, leading to misunderstandings and a sweet love story. A breezy, feel-good romantic drama.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Geetha_Govindam_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Geetha_Govindam_poster.jpg',
      imdb_rating: 6.8,
      box_office: '₹130 crore',
      director: 'Parasuram',
      genres: ['Romance', 'Comedy'],
      cast: [
        { name: 'Vijay Deverakonda', role: 'Vihari', type: 'actor' },
        { name: 'Rashmika Mandanna', role: 'Geetha', type: 'actress' },
      ],
    },
    {
      title: 'Jalsa',
      release_year: 2008,
      duration_min: 158,
      language: 'Telugu',
      synopsis: 'A free-spirited man becomes obsessed with revenge against a corrupt politician who caused his friend\'s death, setting off a chain of events with unexpected twists.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/5/50/Jalsa_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/5/50/Jalsa_poster.jpg',
      imdb_rating: 7.8,
      box_office: '₹60 crore',
      director: 'Trivikram Srinivas',
      genres: ['Action', 'Comedy', 'Drama'],
      cast: [
        { name: 'Pawan Kalyan', role: 'Ram', type: 'actor' },
        { name: 'Ileana D\'Cruz', role: 'Ileana', type: 'actress' },
      ],
    },
    {
      title: 'Jersey',
      release_year: 2019,
      duration_min: 157,
      language: 'Telugu',
      synopsis: 'A failed cricketer, now in his late 30s, decides to make a comeback for his son\'s sake. A deeply emotional sports drama about determination, fatherhood, and second chances.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/8/87/Jersey_Telugu_film_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/8/87/Jersey_Telugu_film_poster.jpg',
      imdb_rating: 8.6,
      box_office: '₹45 crore',
      director: 'Gowtam Tinnanuri',
      genres: ['Drama', 'Family'],
      cast: [
        { name: 'Nani', role: 'Arjun', type: 'actor' },
        { name: 'Shraddha Srinath', role: 'Sarah', type: 'actress' },
      ],
    },
    {
      title: 'Uppena',
      release_year: 2021,
      duration_min: 139,
      language: 'Telugu',
      synopsis: 'A young fisherman falls in love with the daughter of an upper-caste landlord, leading to a tragic clash between love and social prejudice. A moving debut film from Buchi Babu Sana.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Uppena_film_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Uppena_film_poster.jpg',
      imdb_rating: 8.0,
      box_office: '₹50 crore',
      director: 'Buchi Babu Sana',
      genres: ['Romance', 'Drama'],
      cast: [
        { name: 'Panja Vaisshnav Tej', role: 'Aasi', type: 'actor' },
        { name: 'Krithi Shetty', role: 'Bebamma', type: 'actress' },
        { name: 'Vijay Sethupathi', role: 'Rayanam', type: 'actor' },
      ],
    },
    {
      title: 'Fidaa',
      release_year: 2017,
      duration_min: 142,
      language: 'Telugu',
      synopsis: 'An NRI Telugu boy visiting his native village in Telangana falls for a free-spirited local girl. A charming, fresh romance set against the backdrop of rural Telangana culture.',
      poster: 'https://upload.wikimedia.org/wikipedia/en/9/97/Fidaa_poster.jpg',
      banner: 'https://upload.wikimedia.org/wikipedia/en/9/97/Fidaa_poster.jpg',
      imdb_rating: 7.3,
      box_office: '₹55 crore',
      director: 'Sekhar Kammula',
      genres: ['Romance', 'Comedy', 'Drama'],
      cast: [
        { name: 'Varun Tej', role: 'Abhi', type: 'actor' },
        { name: 'Sai Pallavi', role: 'Bhanumathi', type: 'actress' },
      ],
    },
  ];

  const seedTransaction = db.transaction(() => {
    moviesData.forEach(movie => {
      // Find or handle director
      let directorId = null;
      if (movie.director && personIds[movie.director]) {
        directorId = personIds[movie.director];
      }

      const movieResult = insertMovie.run(
        movie.title,
        movie.release_year,
        movie.duration_min,
        movie.language,
        movie.synopsis,
        movie.poster,
        movie.banner,
        movie.imdb_rating,
        movie.box_office,
        directorId,
      );
      const movieId = movieResult.lastInsertRowid;

      // Genres
      movie.genres.forEach(g => {
        try {
          const gId = genreId(g);
          insertMovieGenre.run(movieId, gId);
        } catch (_) { /* genre not found */ }
      });

      // Cast
      movie.cast.forEach(c => {
        const pid = personIds[c.name];
        if (pid) {
          insertCast.run(movieId, pid, c.role, c.type);
        }
      });
    });
  });

  seedTransaction();
  console.log(`✅ Seeded ${moviesData.length} movies and ${persons.length} persons.`);
}

seed();
