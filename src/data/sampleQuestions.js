export const sampleQuestions = [
  // Physics Questions - Easy
  {
    _id: 'phys_e1',
    text: 'A computational physicist is modeling energy transfer in a system where constant forces act on objects causing displacement. If a constant force vector $\\vec{F}$ acts on an object, causing a displacement vector $\\Delta \\vec{r}$, which expression correctly defines the work ($W$) done by this force?',
    type: 'mcq',
    options: [
      '$W = |\\vec{F}| \\cdot |\\Delta \\vec{r}|$',
      '$W = \\vec{F} + \\Delta \\vec{r}$',
      '$W = \\vec{F} \\cdot \\Delta \\vec{r}$',
      '$W = \\dfrac{\\vec{F}}{\\Delta \\vec{r}}$'
    ],
    points: 1
  },
  {
    _id: 'phys_e2',
    text: 'A computational scientist is running a simulation to see the ability of water to absorb heat from a nuclear reactor, he is using $0.04$ kg of water and he wants to see the amount of energy it absorbs when its temperature is raised from $1^\\circ$C to $10^\\circ$C. Note: $C_{W}=(4.186$ J/g$)\\times$ C',
    type: 'mcq',
    options: ['1.6744 J', '16.744 J', '167.44 J', '1674.4 J'],
    points: 1
  },
  {
    _id: 'phys_e3',
    text: 'In a computational simulation of an electrical circuit, a $2\\Omega$ resistor and a $4\\Omega$ resistor are connected in series to a $12$V battery. What is the current Intensity (I) that passes through the $4\\Omega$ resistor?',
    type: 'mcq',
    options: ['2 A', '4 A', '6 A', '12 A'],
    points: 1
  },
  // Physics Questions - Moderate
  {
    _id: 'phys_m1',
    text: 'While modeling an ideal gas in a simulated $1$ m$^{3}$ chamber, the computational scientist decided to see what will happen if the chamber suddenly expanded to $1.5$ m$^{3}$ under pressure of $10$ Pa and he inserted heat energy the system of 10 J. Find the change in the internal energy of the gas.',
    type: 'mcq',
    options: ['15 J', '5 J', '-5 J', '-15 J'],
    points: 2
  },
  {
    _id: 'phys_m2',
    text: 'Imagine modeling an ideal fluid flowing through a horizontal pipe. As your model undergoes a simulation, you take some measurements and store it along the pipe toward the fluid flow, what happens to the sum of the pressure and energy per unit volume?',
    type: 'mcq',
    options: [
      'It increases as the pipe diameter decreases',
      'It decreases as the pipe diameter increases',
      'It remains constant as the pipe diameter changes',
      'It decreases as the pipe diameter decreases'
    ],
    points: 2
  },
  // Physics Questions - Advanced
  {
    _id: 'phys_a1',
    text: 'If an object modeled, as a particle, was projected at an angle $\\theta$ (with respect to the horizontal) with initial velocity $v_{0}$, let the maximum height the particle can reach during its trip is $H$, and the maximum horizontal distance (Range) be $R$, then, neglecting the air resistance, the ratio $\\dfrac{H}{R}$ is:',
    type: 'mcq',
    options: [
      '$\\dfrac{\\tan(\\theta)}{4}$',
      '$\\dfrac{\\cot(\\theta)}{4}$',
      '$\\tan(\\theta)$',
      '$\\cot(\\theta)$'
    ],
    points: 3
  },
  // Chemistry Questions - Easy
  {
    _id: 'chem_e1',
    text: 'A computational scientist tried to model Ethylene (C$_{2}$H$_{4}$) using a software like MATLAB, the software asked him to enter the hybridization type of the double bond between $C^1$ and $C^2$, and the software will give him the bond angle. What is the hybridization of each carbon atom in Ethylene, and the expected bond angle between them?',
    type: 'mcq',
    options: [
      'sp$^{3}$, 109.5$^{\\circ}$',
      'sp$^{2}$, 120$^{\\circ}$',
      'sp, 180$^{\\circ}$',
      'sp$^{2}$, 109.5$^{\\circ}$'
    ],
    points: 1
  },
  {
    _id: 'chem_e2',
    text: 'A computational scientist was comparing F$_2$ and Cl$_2$ via RekJet Python Library. He was surprised that F$_2$, despite having higher electronegativity, had a weaker bond than Cl$_2$. How can you explain that?',
    type: 'mcq',
    options: [
      'Fluorine atoms are larger, causing weaker overlap',
      'Chlorine forms multiple bonds more easily',
      'Fluorine\'s small size causes lone pair repulsion that weakens the bond',
      'Cl$_2$ has a partial ionic character that strengthens the bond'
    ],
    points: 1
  },
  {
    _id: 'chem_e3',
    text: 'In a computational model of gas behavior, the Ideal Gas Law is frequently used to relate macroscopic properties. For an ideal gas with $n$ moles, at temperature $T$ (in Kelvin), and occupying a volume $V$ (in Liters), if $R$ is the ideal gas constant, which expression correctly defines the pressure ($P$) of the gas?',
    type: 'mcq',
    options: [
      '$P = \\dfrac{nRT}{V}$',
      '$P = nRT V$',
      '$P = \\dfrac{RT}{nV}$',
      '$P = \\dfrac{nV}{RT}$'
    ],
    points: 1
  },
  // Chemistry Questions - Moderate
  {
    _id: 'chem_m1',
    text: 'While modeling a methane molecule (CH$_{4}$), a computational scientist noticed it formed a symmetrical shape. According to Valence Shell Electron Pair Repulsion (VSEPR) theory What is the shape of methane molecule?',
    type: 'mcq',
    image: 'https://example.com/methane-shape.png',
    options: [
      'Linear',
      'Trigonal planar',
      'Tetrahedral',
      'Trigonal pyramidal'
    ],
    points: 2
  },
  {
    _id: 'chem_m2',
    text: 'In a computational model of a gas mixture, it\'s often necessary to express the concentration of individual components using mole fractions. Consider a binary gas mixture consisting of $n_A$ moles of component A and $n_B$ moles of component B. Which expression correctly defines the mole fraction ($X_A$) of component A for use in a simulation?',
    type: 'mcq',
    options: [
      '$X_A = \\dfrac{n_A}{n_B}$',
      '$X_A = \\dfrac{n_B}{n_A + n_B}$',
      '$X_A = n_A + n_B$',
      '$X_A = \\dfrac{n_A}{n_A + n_B}$'
    ],
    points: 2
  },
  // Chemistry Questions - Advanced
  {
    _id: 'chem_a1',
    text: 'A computational scientist just made a simulation of a reaction, and he found out that the reaction is endothermic with a net enthalpy change of $\\Delta H = +50 \\text{ kJ/mol}$ and a net entropy change of $\\Delta S = +200 \\text{ J/mol}\\cdot\\text{K}$. The scientist then wants to make the reaction himself in real life, but he needs to know if the reaction is spontaneous or not. At what temperature (in Kelvin) does the reaction become spontaneous?',
    type: 'mcq',
    options: [
      '$T\\ge \\text{15 K}$',
      '$T\\ge \\text{150 K}$',
      '$T\\ge \\text{250 K}$',
      'Never spontaneous'
    ],
    points: 3
  },
  // Mathematics Questions - Easy
  {
    _id: 'math_e1',
    text: 'Simplify the expression: $(5 + 3 \\times 2)^2 - 4 \\times 6 = \\ ?$',
    type: 'mcq',
    options: ['97', '92', '1512', '232'],
    points: 1
  },
  {
    _id: 'math_e2',
    text: 'A computational scientist models the movement of a train. Initially, the train travels 120 km in 2 hours. Then the predict total distance if it continues for more 3 hours at the same calculated average speed is?',
    type: 'mcq',
    options: ['180 km', '240 km', '300 km', '360 km'],
    points: 1
  },
  {
    _id: 'math_e3',
    text: 'A number theory algorithm requires finding the smallest positive integer that is a common multiple of two given integers, 12 and 18. What is the value that the algorithm should return?',
    type: 'mcq',
    options: ['72', '36', '54', '108'],
    points: 1
  },
  // Mathematics Questions - Moderate
  {
    _id: 'math_m1',
    text: 'In a data analysis application, a process is modeled by the quadratic function $f(x)=3x^2-4x+5$ To optimize the process, a computational routine needs to find the minimum output value of this function. What is the minimum value that the routine should identify?',
    type: 'mcq',
    options: ['$\\dfrac{11}{3}$', '$\\dfrac{13}{3}$', '$\\dfrac{15}{3}$', '$\\dfrac{17}{3}$'],
    points: 2
  },
  {
    _id: 'math_m2',
    text: 'A computer-aided design (CAD) system is used to determine the dimensions of a rectangular component. The design specifications state that the length of the rectangle is 5 cm more than twice its width, and its perimeter is 50 cm. What are the dimensions (width $w$ and length $l$) that the CAD system should calculate for this component?',
    type: 'mcq',
    options: [
      '$w=\\dfrac{20}{3}$cm, $l=\\dfrac{55}{3}$cm',
      '$w=\\dfrac{15}{3}$cm, $l=\\dfrac{45}{3}$cm',
      '$w=\\dfrac{10}{3}$cm, $l=\\dfrac{35}{3}$cm',
      '$w=\\dfrac{25}{3}$cm, $l=\\dfrac{65}{3}$cm'
    ],
    points: 2
  },
  // Mathematics Questions - Advanced
  {
    _id: 'math_a1',
    text: 'In computational algorithms that involve summing sequences of numbers, it\'s often necessary to efficiently calculate the sum of the first $N$ positive integers. Which expression correctly defines the sum ($S_N$) of the first $N$ positive integers ($1, 2, 3, \\dots, N$)?',
    type: 'mcq',
    options: [
      '$S_N = N^2$',
      '$S_N = \\dfrac{N(N-1)}{2}$',
      '$S_N = N(N+1)$',
      '$S_N = \\dfrac{N(N+1)}{2}$'
    ],
    points: 3
  },
  // Biology Questions - Easy
  {
    _id: 'bio_e1',
    text: 'In a computational genetic analysis of a family\'s inheritance pattern (in the Figure), the observed trait distribution across generations suggests which of the following is the most likely mode of inheritance?',
    type: 'mcq',
    image: 'https://example.com/genetic-inheritance.png',
    options: [
      'Images of the DNA',
      'Protein shapes',
      'Gene expression levels from RNA',
      'Protein vibration velocity'
    ],
    points: 1
  },
  {
    _id: 'bio_e2',
    text: 'In computational biology, phylogenetic trees are used to:',
    type: 'mcq',
    options: [
      'Track laboratory fossils',
      'Study computer viruses',
      'Test chemicals',
      'Show how species are related through evolution'
    ],
    points: 1
  },
  {
    _id: 'bio_e3',
    text: 'In genomic studies correlating phenotypes with nutrient deficiencies, night blindness is associated with the lack of which vitamin?',
    type: 'mcq',
    options: [
      'Vitamin C',
      'Vitamin A',
      'Vitamin B12',
      'Vitamin B6'
    ],
    points: 1
  },
  // Biology Questions - Moderate
  {
    _id: 'bio_m1',
    text: 'A double-stranded DNA molecule analyzed in silico reveals a total of 125 purines and 125 pyrimidines. Which of the following base compositions is consistent with this data, based on Watson-Crick pairing?',
    type: 'mcq',
    options: [
      '125 adenine and 125 uracil molecules',
      '125 thymine and 125 adenine molecules',
      '125 cytosine and 125 thymine molecules',
      '250 adenine and 250 cytosine molecules'
    ],
    points: 2
  },
  {
    _id: 'bio_m2',
    text: 'A gene mutation occurs in 1 out of every 500 individuals. Under the assumption of statistical independence, what is the probability that two randomly selected individuals both carry the mutation?',
    type: 'mcq',
    options: [
      '1/250',
      '1/500',
      '1/250,000',
      '1/1,000'
    ],
    points: 2
  },
  // Biology Questions - Advanced
  {
    _id: 'bio_a1',
    text: 'In computational molecular biology and gene expression analysis, evaluating the efficiency of heterologous gene expression often involves calculating the Codon Adaptation Index (CAI). For a gene composed of $N$ codons, where $w_i$ is the relative adaptiveness of the $i$-th codon (based on its frequency in a reference set of highly expressed genes), which expression correctly defines the CAI?',
    type: 'mcq',
    options: [
      '$\\text{CAI} = \\frac{1}{N} \\sum_{i=1}^{N} w_i$',
      '$\\text{CAI} = \\prod_{i=1}^{N}{w_i^\\dfrac{1}{N}}$',
      '$\\text{CAI} = \\left( \\sum_{i=1}^{N} \\log w_i \\right)^2$',
      '$\\text{CAI} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^{N} w_i^2}$'
    ],
    points: 3
  },
  // Computer Science Questions - Easy
  {
    _id: 'cs_e1',
    text: 'Problem Title: Chemical Reaction Balance Check\n\nDescription: In computational chemistry, you need to verify if a given chemical reaction is balanced. You are provided with the counts of atoms for two elements (e.g., Hydrogen and Oxygen) on the reactant side and the product side. The reaction is balanced if the count of each atom is the same on both sides.\n\nInput:\nLine 1: Four integers H_R, O_R, H_P, O_P (0 ≤ H_R, O_R, H_P, O_P ≤ 1000), representing Hydrogen and Oxygen counts on Reactant and Product sides, respectively.\n\nOutput:\n"BALANCED" if both Hydrogen and Oxygen are balanced, otherwise "UNBALANCED".\n\nExample:\nInput:\n4 2 4 2\nOutput:\nBALANCED\n\nInput:\n2 1 4 2\nOutput:\nUNBALANCED',
    type: 'code',
    points: 1
  },
  {
    _id: 'cs_e2',
    text: 'Problem Title: 1D Particle Movement Simulation\n\nDescription: You are simulating the movement of a single particle along a 1D line. The particle starts at position 0. You are given a sequence of N commands. Each command is either \'L\' (move left by 1 unit) or \'R\' (move right by 1 unit). Calculate the particle\'s final position after executing all commands.\n\nInput:\nLine 1: An integer N (1 ≤ N ≤ 1000).\nLine 2: A string S of length N, consisting only of \'L\' and \'R\' characters.\n\nOutput: A single integer, the final position of the particle.\n\nExample:\nInput:\n7\nRLRRLRL\nOutput:\n1',
    type: 'code',
    points: 1
  },
  {
    _id: 'cs_e3',
    text: 'Running df.groupby(\'id\').agg([\'mean\',\'count\']) returns:',
    type: 'mcq',
    options: [
      '1-D array',
      'Multi-index DataFrame of means & counts',
      'Only counts',
      'Pivot chart'
    ],
    points: 1
  },
  // Computer Science Questions - Moderate
  {
    _id: 'cs_m1',
    text: 'Problem Title: Finding Local Maxima in 1D Data\n\nDescription: A data acquisition system collects a sequence of N numerical readings. A reading is considered a "local maximum" if its value is strictly greater than its immediate left neighbor and strictly greater than its immediate right neighbor. The first and last readings cannot be local maxima (as they only have one neighbor). Count the total number of local maxima in the sequence.\n\nInput:\nLine 1: An integer N (3 ≤ N ≤ 1000).\nLine 2: N space-separated integers, representing the data points Di (-1000 ≤ Di ≤ 1000).\n\nOutput: A single integer, the count of local maxima.\n\nExample:\nInput:\n7\n10 5 12 8 15 3 20\nOutput:\n2',
    type: 'code',
    points: 2
  },
  {
    _id: 'cs_m2',
    text: 'The loss plateaus after epoch~4. What is the safest first reaction?',
    type: 'mcq',
    image: 'https://example.com/loss-plateau.png',
    options: [
      'Add layers',
      'Raise LR 10×',
      'Train longer',
      'Switch optimizer'
    ],
    points: 2
  },
  // Computer Science Questions - Advanced
  {
    _id: 'cs_a1',
    text: 'Problem Title: Monte Carlo Quarter Circle Area Estimation\n\nDescription: In computational science, Monte Carlo methods are used to estimate areas by random sampling. You are tasked with estimating the area of a quarter circle.\n\nConsider a square with corners at (0,0), (1,0), (0,1), and (1,1). Inscribed within this square is a quarter circle centered at (0,0) with radius 1.\n\nInput:\nLine 1: An integer N (1 ≤ N ≤ 10000), the number of random points.\nNext N lines: Two floating-point numbers x_i, y_i (0.0 ≤ x_i, y_i ≤ 1.0), representing the coordinates of each point.\n\nOutput:\nA single floating-point number, the estimated area of the quarter circle, rounded to 6 decimal places.',
    type: 'code',
    image: 'https://example.com/monte-carlo-circle.png',
    points: 3
  }
]; 