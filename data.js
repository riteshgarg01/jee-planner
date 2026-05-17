// JEE 2027 Syllabus Data
const SYLLABUS = {
  mathematics: {
    label: "Mathematics", color: "math", units: [
      {id:"M1",title:"Sets, Relations and Functions",topics:"Sets, union/intersection, power set, equivalence relations, functions, composition"},
      {id:"M2",title:"Complex Numbers & Quadratic Equations",topics:"Argand diagram, modulus, argument, quadratic roots, nature of roots"},
      {id:"M3",title:"Matrices and Determinants",topics:"Algebra of matrices, determinants, adjoint, inverse, linear equations"},
      {id:"M4",title:"Permutations and Combinations",topics:"Counting principle, P(n,r), C(n,r), applications"},
      {id:"M5",title:"Binomial Theorem",topics:"Positive integral index, general term, middle term"},
      {id:"M6",title:"Sequence and Series",topics:"AP, GP, AM-GM relation, insertion of means"},
      {id:"M7",title:"Limit, Continuity & Differentiability",topics:"Limits, derivatives, chain rule, maxima/minima, rate of change"},
      {id:"M8",title:"Integral Calculus",topics:"Indefinite/definite integrals, substitution, parts, partial fractions, areas"},
      {id:"M9",title:"Differential Equations",topics:"Order, degree, separation of variables, linear DE"},
      {id:"M10",title:"Coordinate Geometry",topics:"Straight lines, circles, parabola, ellipse, hyperbola"},
      {id:"M11",title:"Three Dimensional Geometry",topics:"Distance, section formula, direction cosines, skew lines"},
      {id:"M12",title:"Vector Algebra",topics:"Addition, components, scalar & vector products"},
      {id:"M13",title:"Statistics and Probability",topics:"Mean, median, mode, SD, variance, Bayes' theorem"},
      {id:"M14",title:"Trigonometry",topics:"Identities, inverse trig functions, properties"}
    ]
  },
  physics: {
    label: "Physics", color: "physics", units: [
      {id:"P1",title:"Units and Measurements",topics:"SI units, significant figures, dimensional analysis"},
      {id:"P2",title:"Kinematics",topics:"Uniform/non-uniform motion, projectile, circular motion"},
      {id:"P3",title:"Laws of Motion",topics:"Newton's laws, momentum, friction, circular motion dynamics"},
      {id:"P4",title:"Work, Energy and Power",topics:"Work-energy theorem, conservation, collisions"},
      {id:"P5",title:"Rotational Motion",topics:"Centre of mass, torque, angular momentum, moment of inertia"},
      {id:"P6",title:"Gravitation",topics:"Universal law, Kepler's laws, escape velocity, satellites"},
      {id:"P7",title:"Properties of Solids & Liquids",topics:"Elasticity, fluid pressure, viscosity, Bernoulli, surface tension, heat transfer"},
      {id:"P8",title:"Thermodynamics",topics:"Zeroth/first/second law, isothermal, adiabatic processes"},
      {id:"P9",title:"Kinetic Theory of Gases",topics:"Ideal gas, RMS speed, degrees of freedom, equipartition"},
      {id:"P10",title:"Oscillations and Waves",topics:"SHM, pendulum, wave motion, standing waves, beats"},
      {id:"P11",title:"Electrostatics",topics:"Coulomb's law, electric field, Gauss's law, capacitors"},
      {id:"P12",title:"Current Electricity",topics:"Ohm's law, Kirchhoff's, Wheatstone bridge, metre bridge"},
      {id:"P13",title:"Magnetic Effects & Magnetism",topics:"Biot-Savart, Ampere's law, galvanometer, magnetic materials"},
      {id:"P14",title:"EMI and Alternating Currents",topics:"Faraday's law, Lenz's law, LCR circuit, transformer"},
      {id:"P15",title:"Electromagnetic Waves",topics:"EM spectrum, displacement current, applications"},
      {id:"P16",title:"Optics",topics:"Mirrors, lenses, prism, Young's double slit, diffraction, polarization"},
      {id:"P17",title:"Dual Nature of Matter & Radiation",topics:"Photoelectric effect, de Broglie relation"},
      {id:"P18",title:"Atoms and Nuclei",topics:"Bohr model, hydrogen spectrum, nuclear fission/fusion, binding energy"},
      {id:"P19",title:"Electronic Devices",topics:"Semiconductor diode, Zener, LED, logic gates"},
      {id:"P20",title:"Experimental Skills",topics:"Vernier, screw gauge, pendulum, metre bridge, focal length"}
    ]
  },
  chemistry: {
    label: "Chemistry", color: "chemistry", units: [
      {id:"C1",title:"Some Basic Concepts in Chemistry",topics:"Mole concept, stoichiometry, empirical/molecular formulae"},
      {id:"C2",title:"Atomic Structure",topics:"Bohr model, quantum numbers, orbitals, electronic configuration"},
      {id:"C3",title:"Chemical Bonding & Molecular Structure",topics:"Ionic/covalent bonds, VSEPR, hybridisation, MO theory"},
      {id:"C4",title:"Chemical Thermodynamics",topics:"Enthalpy, Hess's law, Gibbs energy, spontaneity"},
      {id:"C5",title:"Solutions",topics:"Concentration, Raoult's law, colligative properties, van't Hoff factor"},
      {id:"C6",title:"Equilibrium",topics:"Le Chatelier, Kp/Kc, pH, buffer, solubility product"},
      {id:"C7",title:"Redox Reactions & Electrochemistry",topics:"Oxidation number, galvanic cells, Nernst equation, conductance"},
      {id:"C8",title:"Chemical Kinetics",topics:"Rate law, order, first-order kinetics, Arrhenius equation"},
      {id:"C9",title:"Classification of Elements & Periodicity",topics:"Periodic trends, ionization enthalpy, electronegativity"},
      {id:"C10",title:"p-Block Elements",topics:"Group 13-18, trends, unique behaviour of first element"},
      {id:"C11",title:"d- and f-Block Elements",topics:"Transition elements, oxidation states, KMnO4, K2Cr2O7, lanthanoids"},
      {id:"C12",title:"Coordination Compounds",topics:"Werner's theory, nomenclature, isomerism, CFT, VBT"},
      {id:"C13",title:"Purification & Characterisation of Organic Compounds",topics:"Crystallization, distillation, qualitative/quantitative analysis"},
      {id:"C14",title:"Basic Principles of Organic Chemistry",topics:"Hybridisation, isomerism, electronic effects, reaction types"},
      {id:"C15",title:"Hydrocarbons",topics:"Alkanes, alkenes, alkynes, aromatic, Friedel-Crafts"},
      {id:"C16",title:"Organic Compounds — Halogens",topics:"C-X bond, substitution mechanisms, uses"},
      {id:"C17",title:"Organic Compounds — Oxygen",topics:"Alcohols, phenols, ethers, aldehydes, ketones, carboxylic acids"},
      {id:"C18",title:"Organic Compounds — Nitrogen",topics:"Amines, diazonium salts, Gabriel/Hofmann reactions"},
      {id:"C19",title:"Biomolecules",topics:"Carbohydrates, proteins, vitamins, nucleic acids, hormones"},
      {id:"C20",title:"Practical Chemistry",topics:"Salt analysis, titrimetry, functional group tests, preparations"}
    ]
  }
};

// JEE importance weight (higher = more questions typically appear)
const IMPORTANCE = {
  M1:1,M2:2,M3:2,M4:2,M5:1.5,M6:2,M7:3,M8:3,M9:2,M10:3,M11:2,M12:2,M13:2,M14:2,
  P1:1,P2:2,P3:2.5,P4:2,P5:2.5,P6:1.5,P7:2,P8:2,P9:1.5,P10:2.5,P11:3,P12:2.5,P13:2.5,P14:2,P15:1,P16:3,P17:1.5,P18:2,P19:1.5,P20:1,
  C1:1.5,C2:2,C3:2.5,C4:2,C5:2,C6:2.5,C7:2,C8:2,C9:1.5,C10:2.5,C11:2,C12:2.5,C13:1,C14:2.5,C15:2,C16:1.5,C17:2.5,C18:2,C19:1.5,C20:1
};

// Prerequisite ordering (topic -> must come after these)
const PREREQS = {
  M8:["M7"],M9:["M7","M8"],M11:["M10"],M12:["M11"],
  P3:["P2"],P4:["P3"],P5:["P3","P4"],P6:["P3"],P10:["P3","P4"],
  P12:["P11"],P13:["P12"],P14:["P13"],P16:["P10"],P18:["P17"],
  C5:["C1","C4"],C6:["C1"],C7:["C6"],C8:["C1"],C12:["C3","C11"],
  C15:["C14"],C16:["C14","C15"],C17:["C14","C15"],C18:["C14"],C19:["C14"]
};

const RATING_LABELS = [
  "Not studied at all",
  "Aware of basics, need to re-study",
  "Know all concepts, ready to practice",
  "Can solve book-level problems",
  "Can solve JEE-level problems"
];

const RATING_MULTIPLIER = [5, 4, 3, 1.5, 0.5];
const AVG_HOURS_PER_DAY = 7.5;
const DAYS_PER_WEEK = 7;
const END_DATE = new Date(2026, 11, 15); // Dec 15, 2026

window.SYLLABUS = SYLLABUS;
window.IMPORTANCE = IMPORTANCE;
window.PREREQS = PREREQS;
window.RATING_LABELS = RATING_LABELS;
window.RATING_MULTIPLIER = RATING_MULTIPLIER;
window.AVG_HOURS_PER_DAY = AVG_HOURS_PER_DAY;
window.DAYS_PER_WEEK = DAYS_PER_WEEK;
window.END_DATE = END_DATE;
