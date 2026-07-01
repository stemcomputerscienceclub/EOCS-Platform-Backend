export const sampleQuestions = [
  // ==================== EASY ====================

  // Biology Easy
  {
    _id: 'bio_e1',
    text: 'In Mendelian genetics, if a trait is autosomal dominant, which description correctly identifies an affected individual?',
    type: 'mcq',
    options: [
      'They must be homozygous dominant (AA).',
      'They carry at least one dominant allele.',
      'They must have two recessive alleles.',
      'They cannot pass the trait to offspring.'
    ],
    points: 1,
    correctAnswer: 'They carry at least one dominant allele.'
  },
  {
    _id: 'bio_e2',
    text: 'In a population with allele frequency p(A) = 0.7, what is the frequency of the alternative allele a?',
    type: 'mcq',
    options: ['0.7', '0.49', '0.3', '1.7'],
    points: 1,
    correctAnswer: '0.3'
  },
  {
    _id: 'bio_e3',
    text: 'Which molecule is the primary carrier of inherited genetic information in cells?',
    type: 'mcq',
    options: ['DNA', 'ATP', 'Glucose', 'Cholesterol'],
    points: 1,
    correctAnswer: 'DNA'
  },
  {
    _id: 'bio_e4',
    text: 'What insulating material allows action potentials to travel faster along many axons?',
    type: 'mcq',
    options: ['Actin', 'Myelin', 'Hemoglobin', 'Collagen'],
    points: 1,
    correctAnswer: 'Myelin'
  },

  // Chemistry Easy
  {
    _id: 'chem_e1',
    text: 'A program calculates root-mean-square gas speed, which scales as $\\sqrt{T/M}$. If temperature is constant and molar mass becomes four times larger, how does the computed speed scale?',
    type: 'mcq',
    options: ['It doubles.', 'It is cut in half.', 'It quadruples.', 'It is quartered.'],
    points: 1,
    correctAnswer: 'It is cut in half.'
  },
  {
    _id: 'chem_e2',
    text: 'An electroplating simulator uses Faraday\'s law. With current I = 2.0 A for t = 96.5 s and F ≈ 96500 C/mol, how many moles of electrons are transferred?',
    type: 'mcq',
    options: ['0.002 mol', '0.001 mol', '0.200 mol', '2.000 mol'],
    points: 1,
    correctAnswer: '0.002 mol'
  },
  {
    _id: 'chem_e3',
    text: 'For $A \\rightleftharpoons B$, steady-state concentrations are [A] = 2.0 M and [B] = 8.0 M. What is $K_c$?',
    type: 'mcq',
    options: ['0.25', '2.0', '16.0', '4.0'],
    points: 1,
    correctAnswer: '4.0'
  },

  // Physics Easy
  {
    _id: 'phys_e1',
    text: 'If two masses M and m are separated by distance r, which expression defines the magnitude of the gravitational force between them?',
    type: 'mcq',
    options: [
      '$F = \\dfrac{GMm}{r}$',
      '$F = \\dfrac{GMm}{r^2}$',
      '$F = \\dfrac{G(M+m)}{r^2}$',
      '$F = GMmr$'
    ],
    points: 1,
    correctAnswer: '$F = \\dfrac{GMm}{r^2}$'
  },
  {
    _id: 'phys_e2',
    text: 'An isolated system undergoes a collision between two bodies. Which physical quantity must remain conserved?',
    type: 'mcq',
    options: ['Temperature', 'Pressure', 'Momentum', 'Density'],
    points: 1,
    correctAnswer: 'Momentum'
  },
  {
    _id: 'phys_e3',
    text: 'A material has mass m and volume V. Which expression defines density ρ?',
    type: 'mcq',
    options: ['$\\rho = V/m$', '$\\rho = mV$', '$\\rho = m/V$', '$\\rho = m + V$'],
    points: 1,
    correctAnswer: '$\\rho = m/V$'
  },

  // Mathematics Easy
  {
    _id: 'math_e1',
    text: 'Solve for x in the relation $3x + 8 = 23$.',
    type: 'mcq',
    options: ['3', '5', '7', '4'],
    points: 1,
    correctAnswer: '5'
  },
  {
    _id: 'math_e2',
    text: 'A testing loop follows the arithmetic sequence 4, 7, 10, 13, .... What is the 10th term?',
    type: 'mcq',
    options: ['28', '31', '34', '37'],
    points: 1,
    correctAnswer: '31'
  },
  {
    _id: 'math_e3',
    text: 'Solve the inequality $5 - 2x < 11$.',
    type: 'mcq',
    options: ['x < −3', 'x > −3', 'x < 3', 'x > 3'],
    points: 1,
    correctAnswer: 'x > −3'
  },

  // Computer Science Easy
  {
    _id: 'cs_e1',
    text: 'Problem Title: Average Temperature Over Time\n\nA sensor records the temperature of a specific point in a simulation every hour. Given N temperature readings, calculate the average temperature.\n\nInput: Line 1 contains an integer N (1 ≤ N ≤ 1000). Line 2 contains N space-separated integers representing the temperature readings Ti (−50 ≤ Ti ≤ 100).\nOutput: A single floating-point number, the average temperature, rounded to 2 decimal places.\n\nExample Input:\n5\n10 12 8 15 10\nExample Output:\n11.00',
    type: 'code',
    points: 1
  },

  // ==================== MODERATE ====================

  // Biology Moderate
  {
    _id: 'bio_m1',
    text: 'A sensory neuron receives weak and strong stimuli. Both produce action potentials with the same amplitude, but the stronger stimulus feels more intense. What best explains this?',
    type: 'mcq',
    options: [
      'The stronger stimulus increases spike amplitude.',
      'The stronger stimulus increases firing frequency.',
      'The stronger stimulus removes the refractory period.',
      'The stronger stimulus changes the axon diameter immediately.'
    ],
    points: 2,
    correctAnswer: 'The stronger stimulus increases firing frequency.'
  },
  {
    _id: 'bio_m2',
    text: 'The figure shows an ion channel changing from closed to open. Which conclusion is most accurate?',
    type: 'mcq',
    options: [
      'A protein conformational change allows ions to move across the membrane.',
      'The channel destroys all ion gradients immediately.',
      'The channel must always cause an action potential.',
      'The channel prevents any future voltage change.'
    ],
    points: 2,
    correctAnswer: 'A protein conformational change allows ions to move across the membrane.'
  },
  {
    _id: 'bio_m3',
    text: 'A recessive disease allele has frequency q = 0.2 under Hardy–Weinberg equilibrium. What fraction of the population is expected to be affected?',
    type: 'mcq',
    options: ['0.2', '0.04', '0.32', '0.8'],
    points: 2,
    correctAnswer: '0.04'
  },

  // Chemistry Moderate
  {
    _id: 'chem_m1',
    text: 'For a non-linear molecule of N atoms, total degrees of freedom are 3N. After subtracting 3 translational and 3 rotational degrees, how many vibrational degrees of freedom remain?',
    type: 'mcq',
    options: ['3N − 3', '3N − 5', '3N', '3N − 6'],
    points: 2,
    correctAnswer: '3N − 6'
  },
  {
    _id: 'chem_m2',
    text: 'A potential-energy surface algorithm finds a stationary point where the first derivative is zero and the point is a minimum in all directions except one, where it is a maximum. What has it located?',
    type: 'mcq',
    options: [
      'A ground-state global minimum',
      'A completely unbound state',
      'A thermodynamic equilibrium',
      'A reaction transition state'
    ],
    points: 2,
    correctAnswer: 'A reaction transition state'
  },

  // Physics Moderate
  {
    _id: 'phys_m1',
    text: 'For a planet of mass m in a circular orbit of radius r around a star of mass M, which expression gives the total mechanical energy E?',
    type: 'mcq',
    options: [
      '$E = +\\dfrac{GMm}{2r}$',
      '$E = -\\dfrac{GMm}{2r}$',
      '$E = -\\dfrac{GMm}{r}$',
      '$E = 0$'
    ],
    points: 2,
    correctAnswer: '$E = -\\dfrac{GMm}{2r}$'
  },
  {
    _id: 'phys_m2',
    text: 'A satellite\'s circular-orbit radius increases from r to 2r. By what factor does its orbital period T change?',
    type: 'mcq',
    options: ['T becomes ½T', 'T becomes √2 T', 'T becomes 2T', 'T becomes 2√2 T'],
    points: 2,
    correctAnswer: 'T becomes 2√2 T'
  },

  // Mathematics Moderate
  {
    _id: 'math_m1',
    text: 'Find the sum of the first six terms of 3, 6, 12, 24, ....',
    type: 'mcq',
    options: ['189', '93', '381', '192'],
    points: 2,
    correctAnswer: '189'
  },
  {
    _id: 'math_m2',
    text: 'Find the average rate of change of $f(x) = 3x^2 - 2x$ over [1, 4].',
    type: 'mcq',
    options: ['13', '15', '39', '11'],
    points: 2,
    correctAnswer: '13'
  },

  // Computer Science Moderate
  {
    _id: 'cs_m1',
    text: 'A bar chart titled \'Missing Values by Column\' shows null counts for columns Age, Score, City, and Email, with Score having the tallest bar. Which Pandas command should you run first to quantify the tallest bar?',
    type: 'mcq',
    options: ['df.dropna()', 'df.isnull().sum()', 'df.replace()', 'df.fillna(0)'],
    points: 2,
    correctAnswer: 'df.isnull().sum()'
  },
  {
    _id: 'cs_m2',
    text: 'Which call clones a NumPy array so changes to the copy never affect the original?',
    type: 'mcq',
    options: ['b = a', 'b = a.view()', 'b = a.copy()', 'b = np.asarray(a)'],
    points: 2,
    correctAnswer: 'b = a.copy()'
  },

  // ==================== DIFFICULT (ADVANCED) ====================

  // Biology Advanced
  {
    _id: 'bio_a1',
    text: 'Two species differ at 12% of homologous DNA sites. If substitutions accumulate independently in each lineage at 1.5% per million years, when did they diverge?',
    type: 'mcq',
    options: ['4 million years ago', '8 million years ago', '12 million years ago', '18 million years ago'],
    points: 3,
    correctAnswer: '4 million years ago'
  },

  // Chemistry Advanced
  {
    _id: 'chem_a1',
    text: 'A weak acid HA dissociates into H+ and A−. Given $\\alpha = [A^-]/([HA]+[A^-])$ and $K_a = [H^+][A^-]/[HA]$, which formula computes α using only [H+] and $K_a$?',
    type: 'mcq',
    options: [
      '$\\alpha = \\dfrac{K_a}{K_a + [H^+]}$',
      '$\\alpha = \\dfrac{[H^+]}{K_a + [H^+]}$',
      '$\\alpha = K_a [H^+]$',
      '$\\alpha = \\dfrac{K_a + [H^+]}{K_a}$'
    ],
    points: 3,
    correctAnswer: '$\\alpha = \\dfrac{K_a}{K_a + [H^+]}$'
  },

  // Physics Advanced
  {
    _id: 'phys_a1',
    text: 'For a gravitationally bound steady-state system, the virial theorem gives $2\\langle K \\rangle = -\\langle U \\rangle$. If $E_{total} = \\langle K \\rangle + \\langle U \\rangle$, what is $\\langle K \\rangle / E_{total}$?',
    type: 'mcq',
    options: ['1', '−1', '2', '−2'],
    points: 3,
    correctAnswer: '−1'
  },

  // Mathematics Advanced
  {
    _id: 'math_a1',
    text: 'A channel drops packets with probability p = 0.2 per attempt. What is the expected number of attempts required to successfully deliver one packet?',
    type: 'mcq',
    options: ['1.25', '1.5', '2.0', '5.0'],
    points: 3,
    correctAnswer: '1.25'
  },

  // Computer Science Advanced
  {
    _id: 'cs_a1',
    text: 'Average-case lookup time for a Python dict is:',
    type: 'mcq',
    options: ['Θ(log n)', 'Θ(n)', 'Θ(n log n)', 'Θ(1)'],
    points: 3,
    correctAnswer: 'Θ(1)'
  }
];
