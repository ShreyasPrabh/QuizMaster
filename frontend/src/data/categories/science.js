import { createTopic } from '../helpers'

export const SCIENCE_TOPICS = {
  physics: createTopic('physics', 'Physics & Mechanics', '⚛️', 'Science', 'Classical mechanics, Newton’s laws of motion, gravitation, and kinematics.', [
    { title: 'Kinematics & Motion', description: 'Displacement, velocity, acceleration vectors, and projectile trajectories.' },
    { title: 'Newton’s Laws & Forces', description: 'Inertia, F=ma, action-reaction, friction coefficients, and normal force.' },
    { title: 'Work, Energy & Momentum', description: 'Kinetic and potential energy, conservation of momentum, and collisions.' },
    { title: 'Gravitation & Circular Motion', description: 'Universal law of gravitation, centripetal acceleration, and orbits.' },
  ]),

  chemistry: createTopic('chemistry', 'Chemistry & Molecules', '🧪', 'Science', 'Atomic structure, periodic trends, chemical bonding, and stoichiometry.', [
    { title: 'Atomic Structure & Periodic Trends', description: 'Protons, neutrons, electrons, electronegativity, and ionization energy.' },
    { title: 'Chemical Bonds & Geometry', description: 'Ionic, covalent, metallic bonding, Lewis structures, and VSEPR theory.' },
    { title: 'Stoichiometry & Reactions', description: 'Balancing equations, mole concept, limiting reagents, and molar mass.' },
    { title: 'Acids, Bases & Equilibrium', description: 'pH scale, Arrhenius/Bronsted theories, titration, and buffer solutions.' },
  ]),

  biology: createTopic('biology', 'Biology & Genetics', '🧬', 'Science', 'Cellular biology, DNA replication, genetics, organ systems, and ecology.', [
    { title: 'Cell Structure & Organelles', description: 'Mitochondria, nucleus, ribosomes, membrane transport, and ATP.' },
    { title: 'DNA, RNA & Molecular Genetics', description: 'Double helix, replication, transcription, translation, and codons.' },
    { title: 'Human Physiology & Systems', description: 'Circulatory, respiratory, nervous, digestive, and endocrine systems.' },
    { title: 'Ecology & Natural Selection', description: 'Ecosystems, trophic levels, food webs, and Darwinian selection.' },
  ]),

  thermodynamics: createTopic('thermodynamics', 'Thermodynamics & Heat', '⚡', 'Science', 'Laws of thermodynamics, heat engines, entropy, and thermal expansion.', [
    { title: 'Temperature & Thermal Expansion', description: 'Celsius, Kelvin, linear expansion, and volume expansion coefficients.' },
    { title: 'First Law & Heat Transfer', description: 'Conduction, convection, radiation, internal energy, and enthalpy.' },
    { title: 'Second Law, Entropy & Engines', description: 'Carnot cycle, heat engines, efficiency limits, and entropy increase.' },
    { title: 'Phase Changes & Latent Heat', description: 'Specific heat capacity, latent heat of fusion/vaporization, and phase diagrams.' },
  ]),

  electromagnetism: createTopic('electromagnetism', 'Electromagnetism & Optics', '💡', 'Science', 'Electric fields, magnetic induction, circuits, light waves, and refraction.', [
    { title: 'Electric Charges & Coulomb’s Law', description: 'Point charges, electric field lines, and Gauss’s law calculations.' },
    { title: 'DC Circuits & Ohm’s Law', description: 'Resistors in series/parallel, Kirchhoff’s rules, and RC circuits.' },
    { title: 'Magnetic Fields & Faraday’s Induction', description: 'Lorentz force, magnetic flux, Faraday’s law, and Lenz’s law.' },
    { title: 'Wave Optics & Snell’s Law', description: 'Reflection, refraction index, focal length of lenses, and diffraction.' },
  ]),

  organicchem: createTopic('organicchem', 'Organic Chemistry', '🧫', 'Science', 'Hydrocarbons, functional groups, isomerism, nomenclature, and synthesis.', [
    { title: 'Alkanes, Alkenes & Alkynes', description: 'Saturated vs unsaturated hydrocarbons, hybridizations, and naming rules.' },
    { title: 'Functional Groups (Alcohols, Acids)', description: 'Alcohols, aldehydes, ketones, carboxylic acids, esters, and amines.' },
    { title: 'Isomerism & Stereochemistry', description: 'Structural isomers, cis/trans isomerism, chirality, and enantiomers.' },
    { title: 'Organic Reaction Mechanisms', description: 'Electrophilic addition, nucleophilic substitution (SN1/SN2), and elimination.' },
  ]),

  astronomy: createTopic('astronomy', 'Astronomy & Astrophysics', '🪐', 'Science', 'Solar system, stellar evolution, black holes, cosmology, and galaxies.', [
    { title: 'Solar System & Planetary Science', description: 'Terrestrial vs gas giant planets, moons, asteroids, and orbital mechanics.' },
    { title: 'Stellar Evolution & Supernovae', description: 'Nuclear fusion, Main Sequence, red giants, white dwarfs, and neutron stars.' },
    { title: 'Galaxies, Quasars & Black Holes', description: 'Milky Way structure, event horizons, gravitational lensing, and active nuclei.' },
    { title: 'Cosmology & The Big Bang', description: 'Cosmic microwave background, Hubble’s expansion law, dark matter, and dark energy.' },
  ]),

  anatomy: createTopic('anatomy', 'Human Anatomy & Physiology', '🫀', 'Science', 'Skeletal structure, muscular contraction, cardiac cycle, and neurology.', [
    { title: 'Skeletal & Muscular Systems', description: 'Bone classifications, joint articulation, actin-myosin contraction cycle.' },
    { title: 'Cardiovascular & Blood Flow', description: 'Heart chambers, systemic/pulmonary circulation, blood pressure, and valves.' },
    { title: 'Nervous System & Brain Anatomy', description: 'Neurons, action potentials, synapses, brain lobes, and autonomic control.' },
    { title: 'Immune & Lymphatic Defense', description: 'Innate vs adaptive immunity, antibodies, T-cells, B-cells, and lymph nodes.' },
  ]),

  earthscience: createTopic('earthscience', 'Earth & Environmental Science', '🌋', 'Science', 'Plate tectonics, rock cycles, atmospheric layers, and biogeochemical cycles.', [
    { title: 'Plate Tectonics & Earthquakes', description: 'Convergent/divergent boundaries, mantle convection, seismic waves, and faults.' },
    { title: 'The Rock Cycle & Minerals', description: 'Igneous, sedimentary, metamorphic formations, and Mohs hardness scale.' },
    { title: 'Atmosphere, Weather & Climate', description: 'Troposphere to exosphere, Coriolis effect, high/low pressure systems, and fronts.' },
    { title: 'Biogeochemical Cycles & Sustainability', description: 'Carbon cycle, nitrogen cycle, greenhouse effect, and renewable resources.' },
  ]),

  quantum: createTopic('quantum', 'Quantum Physics Basics', '🔮', 'Science', 'Wave-particle duality, Planck’s constant, photoelectric effect, and uncertainty.', [
    { title: 'Wave-Particle Duality & Photons', description: 'Planck-Einstein relation (E=hf), de Broglie wavelength, and double-slit.' },
    { title: 'The Photoelectric Effect', description: 'Threshold frequency, work function, electron kinetic energy, and photon absorption.' },
    { title: 'Bohr Model & Energy Levels', description: 'Quantized electron orbits, Rydberg formula, and emission spectra lines.' },
    { title: 'Heisenberg Uncertainty & Superposition', description: 'Uncertainty principle (ΔxΔp ≥ ℏ/2), wavefunctions, and quantum states.' },
  ]),
}
