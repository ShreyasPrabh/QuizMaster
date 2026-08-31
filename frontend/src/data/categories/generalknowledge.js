import { createTopic } from '../helpers'

export const GENERALKNOWLEDGE_TOPICS = {
  geography: createTopic('geography', 'World Geography & Continents', '🌍', 'General Knowledge', 'Physical geography, mountain ranges, oceans, climatic zones, and continents.', [
    { title: 'Oceans, Seas & Major Waterways', description: 'Major oceans, Panama/Suez canals, and river basins.' },
    { title: 'Mountain Ranges & Landforms', description: 'Himalayas, Andes, Rockies, Alps, and plateaus.' },
    { title: 'Continents, Latitudes & Climates', description: 'Equator, Tropics, time zones, and global climatic biomes.' },
    { title: 'World Countries & Borders', description: 'Landlocked nations, archipelagos, and international borders.' },
  ]),

  history: createTopic('history', 'World History & Civilizations', '🏛️', 'General Knowledge', 'Ancient civilizations, Renaissance, industrial revolution, and world wars.', [
    { title: 'Ancient Civilizations & Empires', description: 'Mesopotamia, Indus Valley, Greece, Rome, and Han Dynasty.' },
    { title: 'Medieval Era & Renaissance', description: 'Feudalism, Byzantine Empire, Silk Road, and printing press.' },
    { title: 'Revolutions & World Wars', description: 'Steam age, American/French revolutions, WWI, and WWII.' },
    { title: 'Cold War & Modern Era', description: 'Space race, Berlin Wall, United Nations, and global milestones.' },
  ]),

  discoveries: createTopic('discoveries', 'Discoveries & Inventions', '🚀', 'General Knowledge', 'Scientific breakthroughs, space missions, aviation milestones, and inventors.', [
    { title: 'Pioneering Inventions', description: 'Telephone, electric bulb, steam engine, and early computers.' },
    { title: 'Medical Breakthroughs', description: 'Penicillin, germ theory, vaccines, and DNA discovery.' },
    { title: 'Space Exploration & Astronomy', description: 'Apollo 11, Hubble, Mars rovers, and planetary probes.' },
    { title: 'Computing & Internet Milestones', description: 'Transistors, ARPANET, World Wide Web, and microprocessors.' },
  ]),

  capitals: createTopic('capitals', 'Capitals & Nations', '📰', 'General Knowledge', 'National capitals, currencies, international treaties, and cultural landmarks.', [
    { title: 'European & Asian Capitals', description: 'Capitals of nations across Europe, Middle East, and Asia.' },
    { title: 'Americas & African Capitals', description: 'Capitals of North America, South America, and Africa.' },
    { title: 'Global Currencies & Central Banks', description: 'Major reserve currencies, IMF, and monetary institutions.' },
    { title: 'UN & World Landmarks', description: 'United Nations headquarters and UNESCO heritage sites.' },
  ]),

  orgs: createTopic('orgs', 'International Organizations & Treaties', '🌐', 'General Knowledge', 'United Nations, NATO, WHO, WTO, European Union, and Geneva Conventions.', [
    { title: 'The United Nations & Core Agencies', description: 'General Assembly, Security Council, UNICEF, and UNESCO.' },
    { title: 'Global Trade & Financial Bodies', description: 'World Bank, IMF, WTO, OECD, and economic blocs.' },
    { title: 'Defense Pacts & Geopolitics', description: 'NATO, ASEAN, African Union, and non-proliferation treaties.' },
    { title: 'Environmental Accords & Human Rights', description: 'Paris Climate Agreement, Kyoto Protocol, and Geneva Conventions.' },
  ]),

  artculture: createTopic('artculture', 'World Art & Cultural Heritage', '🎨', 'General Knowledge', 'Renaissance masterpieces, architectural wonders, world religions, and festivals.', [
    { title: 'Famous Artists & Paintings', description: 'Da Vinci, Michelangelo, Van Gogh, Picasso, and art movements.' },
    { title: 'Seven Wonders & Ancient Architecture', description: 'Pyramids of Giza, Taj Mahal, Colosseum, and Machu Picchu.' },
    { title: 'World Religions & Philosophies', description: 'Major global faiths, sacred texts, and cultural practices.' },
    { title: 'Traditional Festivals & Folk Heritage', description: 'Carnival, Diwali, Lunar New Year, and intangible heritage.' },
  ]),

  spaceexpl: createTopic('spaceexpl', 'Space Exploration & Missions', '🛸', 'General Knowledge', 'NASA, ESA, ISRO, lunar landings, Mars exploration, and space stations.', [
    { title: 'The Space Race Era (1950s-1970s)', description: 'Sputnik, Yuri Gagarin, Apollo missions, and Saturn V rockets.' },
    { title: 'Space Stations & Habitats', description: 'International Space Station (ISS), Mir, and Tiangong.' },
    { title: 'Robotic Rovers & Deep Space Probes', description: 'Curiosity, Perseverance, Voyager 1 & 2, and James Webb Telescope.' },
    { title: 'Private Spaceflight & Lunar Artemis', description: 'SpaceX, reusable rocketry, Artemis program, and Mars colonization.' },
  ]),

  economics: createTopic('economics', 'Global Economics & Trade', '💹', 'General Knowledge', 'GDP, inflation, supply & demand, fiscal policy, and currency exchange.', [
    { title: 'Macroeconomic Indicators (GDP & Inflation)', description: 'Gross Domestic Product, Consumer Price Index, and unemployment.' },
    { title: 'Microeconomic Principles (Supply & Demand)', description: 'Price elasticity, market equilibrium, and opportunity cost.' },
    { title: 'Monetary Policy & Central Banking', description: 'Federal Reserve, interest rates, quantitative easing, and reserves.' },
    { title: 'International Trade & Tariffs', description: 'Free trade agreements, balance of payments, and exchange rates.' },
  ]),

  leaders: createTopic('leaders', 'Famous Leaders & Nobel Laureates', '🏆', 'General Knowledge', 'Historical statesmen, civil rights pioneers, and Nobel prize recipients.', [
    { title: 'Pioneering Statesmen & World Leaders', description: 'Churchill, Lincoln, Gandhi, Mandela, and modern presidents.' },
    { title: 'Civil Rights & Humanitarian Champions', description: 'Martin Luther King Jr., Mother Teresa, and Red Cross founders.' },
    { title: 'Nobel Peace & Literature Laureates', description: 'Notable Nobel Peace winners and literary champions.' },
    { title: 'Scientific & Economic Nobel Laureates', description: 'Einstein, Curie, Feynman, and Nobel economics laureates.' },
  ]),

  literature: createTopic('literature', 'World Literature & Philosophy', '📚', 'General Knowledge', 'Epic poetry, Shakespearean plays, Enlightenment philosophy, and novels.', [
    { title: 'Ancient Epics & Classical Mythology', description: 'Iliad, Odyssey, Epic of Gilgamesh, and Mahabharata.' },
    { title: 'Shakespearean Plays & Renaissance Drama', description: 'Hamlet, Macbeth, Romeo and Juliet, and sonnets.' },
    { title: 'Enlightenment Philosophers', description: 'Socrates, Plato, Aristotle, Locke, Rousseau, and Kant.' },
    { title: 'Modern Literary Masterpieces', description: '1984, To Kill a Mockingbird, War and Peace, and magical realism.' },
  ]),
}
